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
    mimeType = "image/jpeg",
    quality = 0.9
): Promise<Blob> {

    const img = await loadImage(file);

    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;

    const srcRatio = srcW / srcH;
    const targetRatio = targetWidth / targetHeight;

    let cropW = srcW;
    let cropH = srcH;

    // crop style object-fit: cover
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

    ctx.drawImage(
        img,
        cropX,
        cropY,
        cropW,
        cropH,
        0,
        0,
        targetWidth,
        targetHeight
    );

    return canvasToBlob(canvas, mimeType, quality);
}