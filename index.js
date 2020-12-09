import express, { response } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'

const app = express()
app.use(cors())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]
app.use(express.json())
app.use(express.static('build'));


morgan.token('body', function (req, res) {  if(req.method === "POST") return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'));

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
  return maxId + 1 */
  return getRandomInt(5, 1000000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing"
    })
  }

  if(persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (_, res) => {
    const text = `<p>Phonebook has info for ${persons.length} people</p>
                  <p>${new Date()}</p>`
    res.send(text)
})

app.get('/api/persons', (_,res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
