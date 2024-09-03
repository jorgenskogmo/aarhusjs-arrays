
/*

1000* 1000*1000 (1B iterations)

# with ignition (bytecode interpreter) AND Turbofan (optimizing compiler)
% node opt-test.js   
> run: 903.608ms

# without Turbofan
% node --no-opt opt-test.js  
> run: 8.095s

# without any jit (iOS) 
> node --jitless --no-expose_wasm opt-test.js  
> run: 13.505s

# trace
> node --trace-opt opt-test.js


https://v8.dev/blog/jitless
What’s the difference between --jitless and --no-opt?

--no-opt disables the TurboFan optimizing compiler. --jitless disables all runtime allocation of executable memory.

see https://nodejs.org/api/cli.html
see https://flaviocopes.com/node-runtime-v8-options/

*/


// hyperfine "node no-opt.js" "node --no-opt  no-opt.js" --warmup=2



// console.time("run")

// let iterations = 0, sum = 0

function step(j){
  sum += j
  iterations ++
}

// for(let i=0; i<1000; i++){
  for(let j=0; j<1000*1000; j++){
    // sum += j
    // iterations ++
    step(j)
  }
// }

// console.timeEnd("run")


// const formatter = Intl.NumberFormat('en', { notation: 'compact' }) //, minimumSignificantDigits: 2 })
// console.log(formatter.format(iterations), "iterations");

// const formattedNumber = new Intl.NumberFormat('de-DE').format(sum);
// console.log(formattedNumber, "~", formatter.format(sum));

