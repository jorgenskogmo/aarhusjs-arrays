# aarhusjs-arrays

Sept 03, 2024

> Great UX starts with great data ;-)

Building on the work presented at WhiteAway in 2023(?),
code available here:
and recording here:
we're taking another look at how understanding the web-platform
enables not only development of better experiences on the web,
but also opens other "scriptable" environments for creative exploration.

Last time, we looked at how just one html element, the `<canvas>`, was a portal into computational graphics, 3D and now GPU
programming;
this time, we'll look at the `array` datastructure.
New to none, but there should be sth in here for us all.

--

So, an array is just a list of things.
We call the "list" and array, the "things" elements and their position in the list, eh array, their index.

It looks like this:

```js
var array_of_things_with_same_type = [1, 2, 3];
var array_of_things_with_different_type = [
  1,
  2,
  "three",
  [4, 5, 6],
  { key: "a key", value: Date.now() },
];
```

Oh, a quick de-tour (there might be a few of these).
The `array_of_things_with_same_type` is special.
Actually, both cases above is special: `array_of_things_with_different_type` because this way of storing _any_ type of thing in an array is a very javascript-y way (?) - very few other languages support that.
The `array_of_things_with_same_type` where all elements have the same type, is the normal way - and that makes it special for us js-developers ;-)

--

Check

--

Got examples?

- [] basics
- [x] find
- [-] canvas
- [-] sound
- [x] ble (Mario)
- [] json
- [] msgpack
- [] protobuf
- [] csv
