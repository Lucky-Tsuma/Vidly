const log = (_req, _res, next) => {
    console.log("This is a custom middleware functon!")
    next()
}

module.exports = log