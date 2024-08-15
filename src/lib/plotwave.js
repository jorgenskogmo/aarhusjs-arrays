function plot(wave){
  const width = wave.length
  const el = document.createElement("canvas");
  el.setAttribute("width", `${width}px`)
  el.setAttribute("height", `400px`)
  const ctx = e.getContext("2d")
  // ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  let x = 0;
  let y = 200;
  ctx.moveTo(x,y)
  for(let i=0; i<width; i++){
    ctx.lineTo(x, y-y[i])
    x += 1
  }
  ctx.lineWidth = 2;
  ctx.stroke();
}