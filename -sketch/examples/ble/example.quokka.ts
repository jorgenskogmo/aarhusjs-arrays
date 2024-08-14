import {parseAcc} from './example'

const accel = [16, 0, 69, 97, 65, 254, 81, 3, 211, 254, 65, 254, 81, 3, 210, 254]
const buffer = new ArrayBuffer();
const data = new DataView(buffer)

parseAcc(data);
