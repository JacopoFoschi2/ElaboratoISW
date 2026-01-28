async function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };

        img.onerror = reject;
        img.src = url;
    });
}

function canvasToBlob(
    canvas: HTMLCanvasElement,
    mimeType: string,
    quality: number
): Promise<Blob> {

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) reject("Blob creation failed");
            else resolve(blob);
        }, mimeType, quality);
    });
}

export async function resizeFileToBlob(
  file: File,
  targetWidth: number,
  targetHeight: number,
  quality = 0.9
): Promise<Blob> {

  const bitmap = await createImageBitmap(file, {
    imageOrientation: "from-image"
  });

  const srcW = bitmap.width;
  const srcH = bitmap.height;

  const srcRatio = srcW / srcH;
  const targetRatio = targetWidth / targetHeight;

  let cropW = srcW;
  let cropH = srcH;

  if (srcRatio > targetRatio) {
    cropW = srcH * targetRatio;
  } else {
    cropH = srcW / targetRatio;
  }

  const cropX = (srcW - cropW) / 2;
  const cropY = (srcH - cropH) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, targetWidth, targetHeight);

  ctx.drawImage(
    bitmap,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    targetWidth,
    targetHeight
  );

  const mimeType = file.type || "image/jpeg";
  return canvasToBlob(canvas, mimeType, quality);
}
