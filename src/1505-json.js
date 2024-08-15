console.time("run")
// const data = load_customers_from_backend_as_json(100)
const data = Bun.file('data/customers-array-objects.json')
console.log("fileize:", data.size, "bytes, type:", data.type)

const text = await data.text()
const Customers = JSON.parse(text)
// console.log("Customers:", Customers)

const result = Customers.find( customer => customer["Customer Id"] === '28CDbC0dFe4b1Db')
console.log("Customer with id '28CDbC0dFe4b1Db':", result)
console.timeEnd("run")