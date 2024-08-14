
// creation
const a = new Array()
const b = []
const c = [1,2,3]
const d = ["a", 1, {"c":3, d:{e:[4,5,6]}}]

// dynamic population
const e = []
for(let i=0; i<10; i++){
  e.push(i)
}
// [0,1,2...9]

// with size
const f = new Array(2); // [undefined, undefined] 
f.fill(0) // [0,0]

// append, end
f.push(1) // [0,0,1]

// append, start
f.unshift("first")

// set by index
f[2] = "two"

// access, by index
let g = f[0] // 0
g = f[2] // "two"
g = f.at(2) // "two"

// get (and remove) first
g = f.shift()
// 0

// get (and remove) last
g = f.pop()
// "two"

//? Whats f now? 
// [0]

// -- loops

const h = [1,2,3,4,5]

for(let i=0; i<h.length; i++){
  console.log(i) // 0,1,2,3,4
}
for(let index in h){
  console.log(index) // 0,1,2,3,4
}
for(let value of h){
  console.log(value) // 1,2,3,4,5
}
h.forEach( (value, index) => console.log(value, index) )

// -- iterators

console.log( h.map( (value, index) => value + 10)) //  [11, 12, 13, 14, 15]

console.log( h.filter( (value, index) => value > 2)) // 3, 4, 5

// -- range

const j = h.slice(0,3) // [1,2,3]
const k = h.slice(3) // 4,5


// -- rest (spread?)

const [m,n,...o] = h
// m: 1, n: 2, o: [3,4,5]

//-- reduce

const max = h.reduce((prev ,curr) => {

})

const min = 0

const avg = 0

const sum = 0

// -- find
h = ["one", "two", "three"]

h.includes("two") // true
h.includes("four") // false

h.indexOf("three") // 2
h.indexOf("four") // -1



h.find( (value, index) => value === "two") // "two"

h = [{name:"a", v:0}, {name:"b", v:1}, {name:"c", v:2}]
h.find( (value, index) => value.name === "b") // {name:"b", v:1}
h.findIndex( (value, index) => value.name === "b") // 1

// ...and more


/*

so, why is this good to know?

because, for computers (and networks?) (almost) everything is an array - of bits

lets start digging.

in low-level languages (is "distance to bits" a fair metric to determine the low/high level of a language?)


*/