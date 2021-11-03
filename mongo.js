const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password>'
    )
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://zhuang:${password}@cluster0.3knns.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result=>{
        console.log('phonebook:')
        result.forEach(p=>{
            console.log(p.name,p.number)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name,
        number
    })

    person.save().then((result) => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}


