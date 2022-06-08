const express = require("express")
const app = express()
const log = require("./middleware/logger")
const genreRoutes = require("./routes/genres")
require("dotenv").config()
const helmet = require("helmet") // secures express.js apps by setting various HTTP headers
const morgan = require("morgan") // logs HTTP requests made to the server
const config = require("config") //Separate configuration settings for each environment
// on debugging. more on the debug module documentation
const startupDebuger = require("debug")("app:startup")
const dbDebuger = require("debug")("app:db")

app.use(express.json())
app.use(express.static(`${__dirname}/public`)) 
app.use(express.urlencoded({extended:true}))
app.use(log) //How we create and use custom middleware 
app.use(helmet())
app.use("/vidly.com/api", genreRoutes)

const port = config.has("port") ? config.get("port") : 3000 //configuration, more of this concept below

// configuration, this is what we use to override settings for different environments
if(config.has("name")) {
    // config.get will throw an exception for undefined keys to help catch typos and missing values
    console.log(`Application name: ${config.get("name")}`)
    // use config.has to test if a configuration value is defined
    if(config.has("mail.host")) {
        console.log(`Mail server running: ${config.get("mail.host")}`)
    }
}

if(app.get("env") === "development") {
    startupDebuger("Morgan enabled...")
    app.use(morgan("tiny"))
}

// We could hv some db work here. But just to test on the debug module
dbDebuger("Database conneccted...")

app.post("/urlencodedstuff", (req, res) => {
    res.json(req.body)
})

app.use((_req, res) => {
    res.status(404).send("Page not found!")
})

app.listen(port, () => {
    console.log(`Vidly listening on port ${port}...`)
})
