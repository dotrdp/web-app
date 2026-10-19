"""Exports the fixed SAM 2.1 tiny checkpoint to the two ONNX graphs the browser runs.

  encoder: image [1,3,H,W] float 0..255 (H,W <= 1024) -> high_res_0, high_res_1, image_embed
           (the 1024x1024 bilinear resize and ImageNet normalisation are inside the graph)
  decoder: the three feature maps + point_coords [1,N,2] in 1024 space + point_labels [1,N]
           -> low_res_masks [1,3,256,256] logits, iou [1,3]

Large weights are stored as float16 with a Cast back to float32, which halves the download and
keeps every computation in float32 (any WebGPU adapter runs it, shader-f16 or not).

Run once wherever torch and the sam2 package are installed (the GPU is not needed):
  PYTHONPATH=<dir with onnx> services/.venv/bin/python services/export_sam2_onnx.py
then copy .data-cache/sam2-onnx/ to the server. services/model-version.json records the hashes.
"""
from pathlib import Path
import hashlib, json, sys
import numpy as np
import torch, torch.nn as nn, torch.nn.functional as F
import onnx
from onnx import helper, numpy_helper, TensorProto
from sam2.build_sam import build_sam2

ROOT = Path(__file__).resolve().parents[1]
CHECKPOINT = ROOT / '.data-cache/sam2.1_hiera_tiny.pt'
OUT = ROOT / '.data-cache/sam2-onnx'
VERSION = ROOT / 'services/model-version.json'

class Encoder(nn.Module):
    def __init__(self, model):
        super().__init__(); self.model = model
        self.register_buffer('mean', torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1) * 255)
        self.register_buffer('std', torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1) * 255)
    def forward(self, image):
        x = F.interpolate(image, size=(1024, 1024), mode='bilinear', align_corners=False)
        x = (x - self.mean) / self.std
        _, feats, _, _ = self.model._prepare_backbone_features(self.model.forward_image(x))
        feats[-1] = feats[-1] + self.model.no_mem_embed
        sizes = [(256, 256), (128, 128), (64, 64)]
        out = [f.permute(1, 2, 0).reshape(1, -1, *s) for f, s in zip(feats, sizes)]
        return out[0], out[1], out[2]

class Decoder(nn.Module):
    def __init__(self, model):
        super().__init__(); self.model = model
    def forward(self, high_res_0, high_res_1, image_embed, point_coords, point_labels):
        sparse, dense = self.model.sam_prompt_encoder(points=(point_coords, point_labels), boxes=None, masks=None)
        masks, iou, _, _ = self.model.sam_mask_decoder(image_embeddings=image_embed, image_pe=self.model.sam_prompt_encoder.get_dense_pe(),
            sparse_prompt_embeddings=sparse, dense_prompt_embeddings=dense, multimask_output=True, repeat_image=False, high_res_features=[high_res_0, high_res_1])
        return masks, iou

def half_weights(path, minimum=4096):
    """float32 initializers with at least `minimum` values -> float16 + Cast to float32."""
    m = onnx.load(str(path)); casts = []
    for init in m.graph.initializer:
        if init.data_type != TensorProto.FLOAT: continue
        value = numpy_helper.to_array(init)
        if value.size < minimum: continue
        name = init.name; init.CopyFrom(numpy_helper.from_array(value.astype(np.float16), name + '_f16'))
        casts.append(helper.make_node('Cast', [name + '_f16'], [name], to=TensorProto.FLOAT, name='cast_' + name))
    for node in reversed(casts): m.graph.node.insert(0, node)
    onnx.checker.check_model(m); onnx.save(m, str(path))

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    model = build_sam2('configs/sam2.1/sam2.1_hiera_t.yaml', str(CHECKPOINT), device='cpu', apply_postprocessing=False).eval()
    with torch.inference_mode():
        image = torch.rand(1, 3, 256, 256) * 255
        torch.onnx.export(Encoder(model), (image,), OUT / 'encoder.onnx', dynamo=False, opset_version=17,
            input_names=['image'], output_names=['high_res_0', 'high_res_1', 'image_embed'], dynamic_axes={'image': {2: 'height', 3: 'width'}})
        feats = Encoder(model)(image)
        coords, labels = torch.tensor([[[500., 400.], [100., 80.]]]), torch.tensor([[1., 0.]])
        torch.onnx.export(Decoder(model), (*feats, coords, labels), OUT / 'decoder.onnx', dynamo=False, opset_version=17,
            input_names=['high_res_0', 'high_res_1', 'image_embed', 'point_coords', 'point_labels'], output_names=['masks', 'iou'],
            dynamic_axes={'point_coords': {1: 'points'}, 'point_labels': {1: 'points'}})
    if '--fp32' not in sys.argv:
        for name in ('encoder', 'decoder'): half_weights(OUT / f'{name}.onnx')
    info = json.loads(VERSION.read_text()); files = {}
    for name in ('encoder', 'decoder'):
        data = (OUT / f'{name}.onnx').read_bytes(); digest = hashlib.sha256(data).hexdigest()
        files[name] = {'file': f'sam2.1-tiny-{name}-{digest[:16]}.onnx', 'sha256': digest, 'bytes': len(data)}
        (OUT / f'{name}.onnx').rename(OUT / files[name]['file'])
    info['browser'] = {'runtime': 'onnxruntime-web (WebGPU, WebAssembly fallback)', 'files': files}
    VERSION.write_text(json.dumps(info, indent=2) + '\n')
    print(json.dumps(files, indent=2))

if __name__ == '__main__': main()
