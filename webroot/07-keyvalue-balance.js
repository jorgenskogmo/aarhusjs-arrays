const data = `{
  "Index": 1,
  "Customer Id": "DD37Cf93aecA6Dc",
  "First Name": "Sheryl",
  "Last Name": "Baxter",
  "Company": "Rasmussen Group",
  "City": "East Leonard",
  "Country": "Chile",
  "Phone 1": "229.077.5154",
  "Phone 2": "397.884.0519x718",
  "Email": "zunigavanessa@smith.info",
  "Subscription Date": "2020-08-24",
  "Website": "http://www.stephenson.com/"
}`

let charcount_keys = 0
let charcount_vals = 0

const lines = data.split("\n")
lines.forEach( line => {
  if( line.indexOf(":") > 1 ){
    const [key, val, rest] = line.trim().split(":")
    console.log( key, val )
    charcount_keys += key.length
    charcount_vals += val.length
  }
})
const pct = charcount_keys * 100 / charcount_vals
console.log("charcount_keys:", charcount_keys, "charcount_vals:", charcount_vals, "pct:", pct)