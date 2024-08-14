export interface RGBAColor {
    r: number;
    g: number;
    b: number;
    a: number;
}
export const DataToRGBAColor = (data: Uint8Array): RGBAColor => {
    const [r,g,b,a, ..._] = data;
    return {r,g,b,a};
};
