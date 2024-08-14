const multiplyArray_for = (a: number[], b: number[]) => {
  let len = a.length;
  if (len !== b.length) {
    console.log("Error@multiplyArray_for: input must be of equal length");
    return;
  }

  let res = new Array(len);
  for (let i = 0; i < len; i++) {
    res[i] = a[i] * b[i];
  }

  return res;
};

const multiplyArray_map = (a: number[], b: number[]) => {
  let len = a.length;
  if (len !== b.length) {
    console.log("Error@multiplyArray_map: input must be of equal length");
    return;
  }

  let res = a.map((v, i) => v * b[i]);

  return res;
};

const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const b = [9, 8, 7, 6, 5, 4, 3, 2, 1];

const size = 100;

// const r0 = a * b; // not possible

const makeArray = (): number[] => {
  const d = new Array(size)
    .fill(Math.random())
    .map((v, i) => Math.round(v * i * Math.random() * 1000));
  return d;
  // return [{ a: "11" }, ...d];
};

let e = makeArray();
let f = makeArray();
console.time("a");
// const r1 = multiplyArray_map(e, f);
const r2 = multiplyArray_for(e, f);
console.timeEnd("a");

e = makeArray();
f = makeArray();
console.time("b");
const r1 = multiplyArray_map(e, f);
// const r2 = multiplyArray_for(e, f);
console.timeEnd("b");
