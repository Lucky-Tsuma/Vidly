const Joi = require('joi')
const express = require('express')
const app = express()
const log = require('./logger')
// express.json(), express.static() and express.urlencoded() are examples of built in middleware functions in express.js
// We have many third party middleware. Usage be minimised. Impacts app speed. Use only when needed. The two most important are helmet and morgan
require('dotenv').config()
const helmet = require('helmet') // secures express.js apps by setting various HTTP headers
const morgan = require('morgan') // logs HTTP requests made to the server
const config = require('config') //Separate configuration settings for each environment

app.use(express.json()) // express.json() returns a middleware function that parses the body of the request for JSON data and parses it to JSON incase it finds it. Sets the req.body property after that.
app.use(express.static(`${__dirname}/public`)) //__dirname fetched from the module wrapper function
app.use(express.urlencoded({extended:true}))
app.use(log) //This is how we create and use custom middleware in express.json

const port = config.has('port') ? config.get('port') : 3000 //configuration, more of this concept from line 20
const genres = []

// configuration, this is what we use to override settings for different environments
if(config.has('name')) {
    // config.get will throw an exception for undefined keys to help catch typos and missing values
    console.log(`Application name: ${config.get('name')}`)
    // use config.has to test if a configuration value is defined
    if(config.has('mail.host')) {
        console.log(`Mail server running: ${config.get('mail.host')}`)
    }
}

if(app.get('env') === 'development') {
    console.log('Morgan enabled...')
    app.use(morgan('tiny'))
}

app.use(helmet())

const schema = Joi.object({
    name: Joi.string().min(5).required()
})

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
