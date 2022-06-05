const Joi = require('joi')
const express = require('express')
const app = express()
const log = require('./logger')
require('dotenv').config()
app.use(express.json()) // express.json() returns a middleware function that parses the body of the request for JSON data and parses it to JSON incase it finds it. Sets the req.body property after that.
app.use(log) //This is how we create and use custom middleware in express.json

// express.json(), express.static() and express.urlencoded() are examples of built in middleware functions in express.js
app.use(express.static(`${__dirname}/public`)) //__dirname fetched from the module wrapper function

app.use(express.urlencoded({extended:true}))

const port = process.env.PORT || 3000
const schema = Joi.object({
    name: Joi.string().min(5).required()
})
const genres = []

const validateGenre = (genre) => {
    // returns an object which will have either property with a value the other null {error: "value or undefined", value: "value or undefinded"}
    return schema.validate(genre)
}

app.post('/urlencodedstuff', (req, res) => {
    res.json(req.body)
})

app.get('/vidly.com/api', (_req, res) => {
    res.send('You are on vidly homepage.')
})

app.get('/vidly.com/api/genres', (_req, res) => {
    res.send(genres)
})

app.post('/vidly.com/api/genres', (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }
    
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre)
    res.send(genre)
})

app.put('/vidly.com/api/genres/:id', (req, res) => {
    const genre = genres.find(movie => movie.id === parseInt(req.params.id))
    if(!genre) { return res.status(404).send('No genre with the passed id was found') }

    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }

    genre.name = req.body.name
    res.send(genre)  
})

app.delete('/vidly.com/api/genres/:id', (req, res) => {
    const genre = genres.find(movie => movie.id === parseInt(req.params.id))
    if(!genre) { return res.status(404).send('No genre with the passed id was found') }

    const index = genres.indexOf(genre)
    genres.splice(index, 1)

    res.send(genre)
})

app.use((_req, res) => {
    res.status(404).send('Page not found!')
})

app.listen(port, () => {
    console.log(`Vidly listening on port ${port}...`)
})
