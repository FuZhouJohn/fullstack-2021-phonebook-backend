const express = require('express')
const morgan = require('morgan')

morgan.token('request-body', (req, _) => {
    return  req.method === 'POST' ? JSON.stringify(req.body) : ''
})

const app = express()
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['request-body'](req, res),
    ].join(' ')
}))

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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${now}</p>
    `)
})

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        persons = persons.filter(p => p.id !== id)
    }
    response.sendStatus(204)
})

const generateId = () => {
    const min = Math.ceil(5)
    const max = Math.floor(1000000)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const existedPerson = persons.find(p => p.name === person.name)
    if (existedPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = generateId()
    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running in port ${3001}`)
})
