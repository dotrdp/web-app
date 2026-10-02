export function ndviColor(value: number): [number, number, number] {
  const stops: [number, number[]][] = [[-1, [154, 98, 76]], [0, [192, 148, 90]], [.2, [223, 207, 112]], [.4, [173, 197, 90]], [.6, [89, 153, 73]], [.8, [39, 108, 62]], [1, [19, 70, 43]]];
  for (let i = 1; i < stops.length; i++) if (value <= stops[i][0]) {
    const [a, ca] = stops[i - 1], [b, cb] = stops[i];
    const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
    return ca.map((c, k) => Math.round(c + (cb[k] - c) * t)) as [number, number, number];
  }
  return stops.at(-1)![1] as [number, number, number];
}

export function colorNdviPixels(pixels: Uint8ClampedArray, threshold: number, enabled: boolean): { pixels: Uint8ClampedArray; valid: number; displayed: number } {
  const result = new Uint8ClampedArray(pixels.length);
  let valid = 0, displayed = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (!pixels[i + 3]) continue;
    const value = ((pixels[i] << 8) | pixels[i + 1]) / 10000 - 1;
    if (value < -1 || value > 1) continue;
    valid++;
    if (enabled && value + 1e-8 < threshold) continue;
    const [r, g, b] = ndviColor(value);
    result[i] = r; result[i + 1] = g; result[i + 2] = b; result[i + 3] = 240;
    displayed++;
  }
  return { pixels: result, valid, displayed };
}

const cache = new Map<string, { pixels: Uint8ClampedArray; width: number; height: number }>();
export async function coloredNdviUrl(url: string, threshold: number, enabled: boolean) {
  let source = cache.get(url);
  if (!source) {
    const image = new Image(); image.src = url; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    context.drawImage(image, 0, 0);
    source = { pixels: context.getImageData(0, 0, image.width, image.height).data, width: image.width, height: image.height };
    cache.set(url, source);
  }
  const canvas = document.createElement('canvas'); canvas.width = source.width; canvas.height = source.height;
  const result = colorNdviPixels(source.pixels, threshold, enabled);
  canvas.getContext('2d')!.putImageData(new ImageData(result.pixels as Uint8ClampedArray<ArrayBuffer>, source.width, source.height), 0, 0);
  return { url: canvas.toDataURL('image/png'), valid: result.valid, displayed: result.displayed };
}
