import mongoose from 'mongoose'

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
    process.exit(1)
}



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://davide:${password}@cluster0.aq2vg.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex:true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if(name != undefined && number != undefined) {
    const person_1 = new Person({
        name: name,
        number: number,
    })

    person_1.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}