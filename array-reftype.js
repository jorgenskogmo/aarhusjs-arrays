class Foo {
  constructor(id, friends) {
    this.id = id;
    this.friends = friends;
  }
}

// array of Foo instances:
const foos = [];

// array of numbers:
const list = [];

for (let i = 0; i < 5; i++) {
  list.push(i);
  console.log(`at i=${i}, our list is: ${list}`);
  foos.push(new Foo(i, list));
}
console.log("after loop:", list, foos);

list.push(888);

console.log("done:", list, foos);

// see? changes to the $list that happened after it was passed to
// a Foo instance was "updated" in each instance
// this is because Arrays are not passed with its (current) value,
// but as a REFERENCE to the array instance itself
