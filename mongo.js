
import dotenv from 'dotenv'
dotenv.config();
const url = process.env.MONGODB_URI
console.log('connecting to', url)

const name = process.argv[2]
const number = process.argv[3]


mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex:true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)
if (process.argv.length == 2) {
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