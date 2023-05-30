function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(500).json({ error: true, data: null, message: err.message })
    }
    res.status(500).json({ error: true, data: null, message: err })

}


module.exports = errorHandler;