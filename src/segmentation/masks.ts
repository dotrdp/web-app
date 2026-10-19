// SAM's mask post-processing, as SAM2ImagePredictor does it, for the in-browser model.

/** torch.nn.functional.interpolate(mode='bilinear', align_corners=False) from 256² logits, > 0. */
export function upsample(logits: Float32Array, offset: number, size: number, width: number, height: number) {
  const mask = new Uint8Array(width * height);
  const sx = size / width, sy = size / height;
  for (let y = 0; y < height; y++) {
    const fy = Math.max(0, (y + .5) * sy - .5), y0 = Math.floor(fy), y1 = Math.min(y0 + 1, size - 1), wy = fy - y0;
    for (let x = 0; x < width; x++) {
      const fx = Math.max(0, (x + .5) * sx - .5), x0 = Math.floor(fx), x1 = Math.min(x0 + 1, size - 1), wx = fx - x0;
      const at = (r: number, c: number) => logits[offset + r * size + c];
      const v = (1 - wy) * ((1 - wx) * at(y0, x0) + wx * at(y0, x1)) + wy * ((1 - wx) * at(y1, x0) + wx * at(y1, x1));
      mask[y * width + x] = v > 0 ? 1 : 0;
    }
  }
  return mask;
}

/** Run lengths over the row-major mask, starting with a run of zeros (services/segmentation.py). */
export function runLengths(mask: Uint8Array) {
  const runs: number[] = []; let current = 0, length = 0;
  for (const v of mask) { if (v === current) length++; else { runs.push(length); current = v; length = 1; } }
  runs.push(length); return runs;
}
