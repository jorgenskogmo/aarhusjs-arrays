console.time("run")
// const data = load_customers_from_backend_as_csv(100)
const data = Bun.file("data/customers.csv");
console.log("fileize:", data.size, "bytes, type:", data.type)

const text = await data.text()
const lines = text.split(/\r\n|\r|\n/)

const Customers = []

class Customer {
  constructor(datafields, dataline){
    const fields = datafields.split(/,/g)
    const items = dataline.split(/,/g)

    // assign
    // fields.forEach( (field,index) => {
    //   this[field] = items[index]
    // });

    // filter, remap and assign
    this.index = parseInt( items[ fields.indexOf("Index") ] );
    this.id = items[ fields.indexOf("Customer Id") ];
    this.name = items[ fields.indexOf("First Name") ] +' '+ items[ fields.indexOf("Last Name") ];
    this.email = items[ fields.indexOf("Email") ];
    
  }
}



const fields = lines.shift() // grab and remove first line
lines.filter(line => line.length > 0).forEach(line => {
  Customers.push( new Customer(fields, line))
});

// console.log("Customers:", Customers)

const result = Customers.find( customer => customer.id === '28CDbC0dFe4b1Db')
console.log("Customer with id '28CDbC0dFe4b1Db':", result)
console.timeEnd("run")

