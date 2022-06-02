const Joi = require('joi')
const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json()) // To enable parsing of json in the request body

const port = process.env.PORT || 3000
const schema = Joi.object({
    name: Joi.string().min(5).required()
})
const genres = []

const validateGenre = (genre) => {
    // returns an object which will have either property with a value the other null {error: "value or undefined", value: "value or undefinded"}
    return schema.validate(genre)
}


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
