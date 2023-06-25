const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === "CastError") {
        response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === "ValidationError") {
        response.status(400).json({ error: error.message})
    } else if (error.name === "JsonWebTokenError") {
        response.status(400).json({ error: error.message})
    }
}

const tokenExtractor = (request, response, next) => {
    const auth = request.get('authorization')
    let token = null
    if (auth && auth.startsWith('Bearer ')) {
        token = auth.replace('Bearer ', '')
    }
    request.token = token
    next()
}

const userExtractor = async (request, response, next) => {
    try {
        if (!request.token) {
            return response.status(401).json({ error: 'must provide token'})
        }
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'invalid token'})
        }
        const user = await User.findById(decodedToken.id)

        request.user = user
        next()
    } catch(error) {
        next(error)
    }
}

module.exports = { requestLogger, errorHandler, tokenExtractor, userExtractor }