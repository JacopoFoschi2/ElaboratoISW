type ImageBuffer =
    | { type?: 'Buffer'; data: number[] | Record<string, number> }
    | number[]
    | Record<string, number>;


const createdUrls: string[] = [];

const normalizeBuffer = (input: any): number[] => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (input.data) return normalizeBuffer(input.data);
    return Object.values(input);
};

export const bufferToUrl = (imageBuffer?: any): string => {
    if (!imageBuffer?.data) return '';
    const base64 = String.fromCharCode(...imageBuffer.data);

    const mime =
        base64.startsWith('/9j/') ? 'image/jpeg' :
            base64.startsWith('iVBOR') ? 'image/png' :
                base64.startsWith('UklGR') ? 'image/webp' :
                    'image/*';

    return `data:${mime};base64,${base64}`;
};