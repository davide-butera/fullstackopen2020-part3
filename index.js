import express, { response } from 'express'

const app = express()

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]
app.use(express.json())

const generateId = () => {
  const maxId = persons.length > 0 
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1 
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  
  if(!body.content) {
    return response.status(400).json({
      error: "content missing"
    })
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }
  
  persons = persons.concat(note)

  response.json(note)
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
  const note = persons.find(note => note.id === id)
  
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)

  res.status(204).end()
})




const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

