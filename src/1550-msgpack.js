import { deepStrictEqual } from "assert";
import { sizeOf } from "./lib/object-size"
const sizeof = require('object-sizeof')

import { encode, decode } from "@ygoe/msgpack"; // 560 lines, minified: 7.0 kB, gzip: 2.7 kB.

// Define some data
var sourceData = {
  number: 123,
  number2: -0.129,
  text: "Abc with Üñıçôðé and ユニコード",
  flag: true,
  list: [ 1, 2, 3 ],
  obj: { a: 1, b: "2", c: false, d: { a: 0, b: -1 } },
  time: Date.now()
};



// Serialize to byte array
var bytes = encode(sourceData);
console.log(bytes)
console.log( sizeOf(bytes) )
console.log( sizeof(bytes) )
console.log( bytes.byteLength )

// Deserialize again
var deserializedData = decode(bytes);
console.log(deserializedData)
console.log( sizeOf(deserializedData) )
console.log( sizeof(deserializedData) )

var s = JSON.stringify(deserializedData)
console.log(s)
var b = Buffer.from( s )
console.log(b)

deepStrictEqual(deserializedData, sourceData)
