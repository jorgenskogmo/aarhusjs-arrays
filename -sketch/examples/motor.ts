export interface Motor {
    port: number; // 0=A, 1=B, ...
    speed: number;
    direction: 'cw' | 'ccw';
}

const data = new Uint8Array([1,88,0]);

export const DataToMotor = (data: Uint8Array): Motor => {
    const [port, speed, d] = data;
    return {port, speed, direction: d === 0 ? 'cw' : 'ccw'};
}

export const MotorToData = (m: Motor): Uint8Array => {
    return new Uint8Array([
        m.port,
        m.speed,
        m.direction === 'cw' ? 0 : 1
    ])
}