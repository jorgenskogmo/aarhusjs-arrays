/*
  Run with
  hyperfine "node compare.js" "node --jitless --no-expose_wasm compare.js" "node --no-opt compare.js" --warmup=2
**/

let iterations = 0;
let sum = 0;
for (let i = 0; i < 1000; i++) {
  for (let j = 0; j < 1000 * 1000; j++) {
    sum += j;
    iterations++;
  }
}
console.log("sum:", sum, "iterations:", iterations);
// sum: 499999500000000 iterations: 1.000.000.000 (1B)
