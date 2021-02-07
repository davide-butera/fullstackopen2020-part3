import express, { response } from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()
app.use(cors())

import Person from './models/person.js'

app.use(express.static('build'))
app.use(express.json())

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
} */

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


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.get('/info', (_, res) => {
    const text = `<p>Phonebook has info for ${person.length} person</p>
                  <p>${new Date()}</p>`
    res.send(text)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)