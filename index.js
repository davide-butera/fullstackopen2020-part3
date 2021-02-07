import express, { response } from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()
app.use(cors())

import Person from './models/person.js'


app.use(express.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) {  if(req.method === "POST") return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));
/*
//From Mozilla's Javascript Reference
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const generateId = () => {
  /*const maxId = persons.length > 0 
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1 
  return getRandomInt(5, 1000000)
}*/

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body.name)
  console.log(body.number)
  Person.findOneAndUpdate({name:body.name}, {number: body.number}, {new: true})  
    .then(updatedPerson => {
      console.log(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (_, res) => {
    Person.countDocuments({}, (_, count) => {
      console.log(count)
      const text = `<p>Phonebook has info for ${count} person</p>
      <p>${new Date()}</p>`
      res.send(text)
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})



app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()    
      } 
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
