// creation
const a0 = new Array();
const a1 = [];
const a = [1, 2];
// there is more to this - in a few slides

// add
a.push(3); //?a
a.unshift(0); //?a

// remove
a.pop(); //?a
a.shift(); //?a

// get
const b = a[0]; //?a

// Exercise:
var some_languages = ["css", "html", "fortran"];
// Can you tell me, which of these array elements
// is the name of a language rarely (if ever?)
// known by JavaScript developers?
var rarely_known = undefined; // <-

// find
a.indexOf(2); //?
a.includes(2); //?
a.find((v) => v === 2); //?
a.findIndex((v) => v === 2); //?
a.filter((v) => v > 1); //?

// update
a[0] = 100; //?a

// spread
const [foo, bar] = a;
console.log("foo:", foo, "bar:", bar);

// reduce
const min = a.reduce((acc, val) => (acc < val ? acc : val));
console.log("min:", min);

const max = a.reduce((acc, val) => (acc > val ? acc : val));
console.log("max:", max);

const sum = a.reduce((acc, val) => acc + val);
console.log("sum:", sum);

const avg = a.reduce((acc, val, _index, { length }) => acc + val / length, 0);
console.log("avg:", avg);

// iterate
console.log("-- iterate --");

// a.map((v) => Math.pow(v,2)) //?
const _ = a.map((v) => v ** 2); //?

a.forEach((v, index) => console.log("foreach @", index, "=", v));

for (const v of a) {
  console.log(":", v);
}

//...and there is more.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
