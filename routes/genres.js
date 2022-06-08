const express = require("express")
const router = express.Router()
const Joi = require("joi")

const genres = []

// fxns should probably be in sm other folder. Keeping things short here
const schema = Joi.object({
    name: Joi.string().min(5).required()
})

const validateGenre = (genre) => {
    // returns an object which will have either property with a value the other null {error: "value or undefined", value: "value or undefinded"}
    return schema.validate(genre)
}

router.get("/", (_req, res) => {
    res.send("You are on vidly homepage.")
})

router.get("/genres", (_req, res) => {
    res.send(genres)
})

router.post("/genres", (req, res) => {
    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }
    
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genre)
    res.send(genre)
})

router.put("/genres/:id", (req, res) => {
    const genre = genres.find(movie => movie.id === parseInt(req.params.id))
    if(!genre) { return res.status(404).send("No genre with the passed id was found") }

    const { error } = validateGenre(req.body)
    if (error) { return res.status(400).send(error.details[0].message) }

    genre.name = req.body.name
    res.send(genre)  
})

router.delete("/genres/:id", (req, res) => {
    const genre = genres.find(movie => movie.id === parseInt(req.params.id))
    if(!genre) { return res.status(404).send("No genre with the passed id was found") }

    const index = genres.indexOf(genre)
    genres.splice(index, 1)

    res.send(genre)
})

module.exports = router
