var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function nullthrows(val, message) {
  if (val == null) {
    throw new Error(message);
  }
  return val;
}
class GPUWaveformRenderer {
  constructor(cellPipeline, channelData, device, context) {
    __publicField(this, "bindGroup");
    __publicField(this, "vertices");
    __publicField(this, "vertexBuffer");
    __publicField(this, "vertexCount");
    __publicField(this, "uniformArray");
    __publicField(this, "uniformBuffer");
    __publicField(this, "channelData");
    __publicField(this, "channelDataStorage");
    __publicField(this, "cellPipeline");
    __publicField(this, "device");
    __publicField(this, "context");
    this.device = device;
    this.context = context;
    const canvas = this.context.canvas;
    this.vertices = new Float32Array([
      //   X,    Y,
      // Triangle 1
      -1,
      -1,
      1,
      -1,
      1,
      1,
      // Triangle 2
      -1,
      -1,
      1,
      1,
      -1,
      1
    ]);
    this.vertexBuffer = this.device.createBuffer({
      label: "Cell vertices",
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    this.vertexCount = this.vertices.length / 2;
    this.uniformArray = new Float32Array([1, canvas.width, canvas.height, 0]);
    this.uniformBuffer = this.device.createBuffer({
      label: "Grid Uniforms",
      size: this.uniformArray.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.channelData = channelData;
    this.channelDataStorage = this.device.createBuffer({
      label: "Channel Data",
      size: channelData.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    this.cellPipeline = cellPipeline;
    this.bindGroup = this.device.createBindGroup({
      label: "Cell renderer bind group",
      layout: cellPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: this.uniformBuffer }
        },
        {
          binding: 1,
          resource: { buffer: this.channelDataStorage }
        }
      ]
    });
  }
  // TODO: make other things use create too for consistency and to remove duplication. `createPipeline` should be private.
  static async create(canvas, channelData) {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported in this browser.");
    }
    const context = nullthrows(
      canvas.getContext("webgpu"),
      "nil webgpu context"
    );
    const adapter = await navigator.gpu.requestAdapter();
    if (adapter == null) {
      throw new Error("No appropriate GPUAdapter found.");
    }
    const device = await adapter.requestDevice();
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: canvasFormat,
      // https://webgpufundamentals.org/webgpu/lessons/webgpu-transparency.html
      alphaMode: "premultiplied"
      //by default, canvas is opaque. dont ignore alpha.
    });
    return GPUWaveformRenderer.createPipeline(
      channelData,
      device,
      context,
      canvasFormat
    );
  }
  static createPipeline(channelData, device, context, canvasFormat) {
    const vertexBufferLayout = {
      arrayStride: 8,
      attributes: [
        {
          format: "float32x2",
          offset: 0,
          shaderLocation: 0
          // Position, see vertex shader
        }
      ]
    };
    const cellShaderModule = device.createShaderModule({
      label: "Cell shader",
      code: `
          struct VertexInput {
            @location(0) pos: vec2f,
            @builtin(instance_index) instance: u32,
          };
          
          struct VertexOutput {
            @builtin(position) pos: vec4f,
            @location(0) cell: vec2f,
          };
  
          @group(0) @binding(0) var<uniform> uniforms: vec4f;
          @group(0) @binding(1) var<storage> channelData: array<f32>;
          
          @vertex
          fn vertexMain(
            @location(0) pos: vec2f,
            @builtin(instance_index) instance: u32
          ) -> VertexOutput {
  
            // let i = f32(instance);

            // Compute the cell coordinate from the instance_index
            // let cell = vec2f(i % uniforms[0], floor(i / uniforms[0]));
          
            var output: VertexOutput;
            output.pos = vec4f(pos, 0, 1);
            output.cell = vec2f(0, 0); // unused
            return output;
          }
  
          struct FragInput {
            @location(0) cell: vec2f,
          };
  
          // 4s = 192,000 samples
          
          @fragment
          fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {            
            let SCALE_FACTOR = uniforms[0];
            let WIDTH = uniforms[1];
            let HEIGHT = uniforms[2];
            let OFFSET = i32(uniforms[3]);

            let index = i32(floor(input.pos.x * f32(SCALE_FACTOR)));
            let sample = channelData[OFFSET + index];
  
            var min_sample = sample;
            var max_sample = sample;
  
            var i = 0;
            for (; f32(i) < SCALE_FACTOR; i++) {
              let fwd = channelData[OFFSET + index + i];
              max_sample = max(max_sample, fwd);
              min_sample = min(min_sample, fwd);
              // sample = select(sample, fwd, abs(fwd) > abs(sample));
              // i += 1;
            }
  
            // sample = 0.4;
            // let c = input.cell / scale;
            // return vec4f(c, 1-c.y, 1);
            // let red = vec4f(1, 0, 0, 1);
            // let cyan = vec4f(0, 1, 1, 1);
            // to make red/cyan checkered scale
            // let scale = vec2u(input.pos.xy) / 8;
            // let checker = (scale.x + scale.y) % 2 == 1;
            // return select(red, cyan, checker);
  
            // PCM is -1 to 1 btw
            // normalized -1 to 1, where -1 is down and 1 is up
            let yPosNorm = -1 * (2 * (floor(input.pos.y) / HEIGHT) - 1);

            // return select(
            //   vec4f(0, 0, 0, 0),
            //   vec4f(0, 1, 0, 1),
            //   input.pos.y <= HEIGHT
            // );
            // return vec4f(0, floor(input.pos.y) / HEIGHT, 0, 1);
            
            // let checker = 
            //   // same sign
            //   (yPosNorm * sample) > 0 && 
            //   // closer to 0
            //   abs(yPosNorm) <= abs(sample);
            // let yval = select(f32(0), f32(1), checker);
            // let debugVal = select(f32(0), f32(1), 1 > 0);
            // let yToSampleDist = 1 - (abs(sample - yPosNorm));
            // let ytmax = 1 - (abs(max_sample - yPosNorm));
            // let ytmin = 1 - (abs(min_sample - yPosNorm));
            // let s = select(f32(0), f32(1), yToSampleDist > 0.99);
            // let sup = select(f32(0), f32(1), ytmax > 0.99);
            // let sdown = select(f32(0), f32(1), ytmin > 0.99);
  

            // 0.02 just so the lines look connected
            let sfinal = select(
              vec4f(0, 0, 0, 0),
              vec4f(0, 1, 0, 1),
              yPosNorm <= max_sample + 0.02 && yPosNorm + 0.02 >= min_sample
            );
            
            
            return sfinal;
          }
        `
    });
    const cellPipeline = device.createRenderPipeline({
      label: "Cell pipeline",
      layout: "auto",
      vertex: {
        module: cellShaderModule,
        entryPoint: "vertexMain",
        buffers: [vertexBufferLayout]
      },
      fragment: {
        module: cellShaderModule,
        entryPoint: "fragmentMain",
        targets: [
          {
            format: canvasFormat
          }
        ]
      }
    });
    const waveformRenderer = new GPUWaveformRenderer(
      cellPipeline,
      channelData,
      device,
      context
    );
    return waveformRenderer;
  }
  render(scale, offset, width, height) {
    const { context, device } = this;
    const canvas = this.context.canvas;
    canvas.width = width;
    canvas.height = height;
    this.uniformArray[0] = scale;
    this.uniformArray[1] = width;
    this.uniformArray[2] = height;
    this.uniformArray[3] = offset;
    device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices);
    device.queue.writeBuffer(this.uniformBuffer, 0, this.uniformArray);
    device.queue.writeBuffer(this.channelDataStorage, 0, this.channelData);
    const renderPassOpts = {
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: "clear",
          // other clear value?
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          storeOp: "store"
        }
      ]
    };
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassOpts);
    pass.setPipeline(this.cellPipeline);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(this.vertexCount);
    pass.end();
    device.queue.submit([encoder.finish()]);
  }
}
export {
  GPUWaveformRenderer
};
