// copy || reference

class Foo {
  friends: Number[];
  id: Number;
  constructor(id: Number, friends: Number[]) {
    this.id = id;
    this.friends = friends;
  }
}

function Bar(id: Number, friends: Number[]) {
  this.id = id;
  this.friends = friends;
}

let foos: Foo[] = [];
let list: Number[] = [];

for (let i = 0; i < 5; i++) {
  list.push(i);
  foos.push(new Foo(i, list));
  // foos.push( new Bar(i, list))
  console.log(`at ${i}, list is ${list}`);
}

console.log("after loop:", list, foos);

list.push(888);

console.log("done:", list, foos);
