const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response, next) => {
    const { username, password } = request.body

    const user = await User.findOne({username})

    // check to see if we found a user
    if (user === null) {
        return response.status(401).json({
            error: "User not found."
        })
    }

    // check password
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
        return response.status(401).json({
            error: "Incorrect password."
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response.status(200).send({
        token, username: user.username, name: user.name
    })
})





module.exports = loginRouter