// canvas

const size = { w: 0, h: 0 };

let el: HTMLDivElement;
let g: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let imageData: ImageData;
let buffer: Uint8ClampedArray;

export const update = () => {
  // A
  // ctx.clearRect(0, 0, size.w, size.h);
  // const blockSize = 10;
  // for (let y = 0; y < size.h; y += blockSize) {
  //   for (let x = 0; x < size.w; x += blockSize) {
  //     const color = Math.floor(Math.random() * 255);
  //     ctx!.fillStyle = `rgb(${color},${color},${color},1)`;
  //     ctx!.fillRect(x, y, blockSize, blockSize);
  //   }
  // }

  // const imageData = ctx.createImageData(size.w, size.h);
  // for (let i = 0; i < imageData.data.length; i += 4) {
  //   const color = Math.floor(Math.random() * 255);
  //   imageData.data[i + 0] = color;
  //   imageData.data[i + 1] = color;
  //   imageData.data[i + 2] = color;
  //   imageData.data[i + 3] = 255;
  // }
  // ctx!.putImageData(imageData, 0, 0);

  for (let i = 0; i < buffer.length; i += 4) {
    const color = Math.floor(Math.random() * 255);
    buffer[i + 0] = color;
    buffer[i + 1] = color;
    buffer[i + 2] = color;
    buffer[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);

  requestAnimationFrame(update);
};

//

export const setup = async () => {
  el = document.querySelector("#main") as HTMLDivElement;
  const dpi = window.devicePixelRatio;
  size.w = 1000; //Math.floor(window.innerWidth);
  size.h = size.w; //Math.round((size.w * 9) / 16);
  el.innerHTML = `<canvas id="g" width="${size.w}px" height="${size.h}px"></canvas>`;
  await sleep(10);

  g = document.querySelector("#g") as HTMLCanvasElement;
  g.width = size.w * dpi;
  g.height = size.h * dpi;
  g.style.width = size.w + "px";
  g.style.height = size.h + "px";

  ctx = g.getContext("2d") as CanvasRenderingContext2D;
  ctx.scale(dpi, dpi);

  imageData = ctx.createImageData(size.w, size.h);
  buffer = imageData.data;

  console.log("Pixels:", size.w * size.h);
  console.log("imageData:", imageData)
  
  update();
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const randomColor = (i) => {
  const colors = ["#f90", "#f09", "#9f0", "#90f", "#0f9", "#09f"];
  // const colors = ["#f90", "#f09", "#9f0", "#90f", "#09f"];
  //const colors = ["#f00", "#fff"];
  return colors[i % colors.length];
};
