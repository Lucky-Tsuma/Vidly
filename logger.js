const log = (req, res, next) => {
    console.log("This is a custom middleware functon!")
    next()
}

module.exports = log