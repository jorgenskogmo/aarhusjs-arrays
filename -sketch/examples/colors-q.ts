import { DataToRGBAColor } from './colors.ts'
import { DataToMotor } from './motor.ts'

const colordata = new Uint8Array([255,128,0,200]);
const motordata = new Uint8Array([1,88,0]);

const data = new Uint8Array([
    0xFF, // type
    4, // length
    ...colordata, // payload
    2, // type
    3, // length
    ...motordata // payload
])

const color = DataToRGBAColor( colordata ); //?

console.log(color, color.r);