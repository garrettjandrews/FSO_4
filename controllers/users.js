const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response, next) => {
    try {
        const users = await User.find({}).populate('blogs')
        response.status(200).json(users)
    } catch(exception) {
        next(exception)
    }
})

userRouter.post('/', async (request, response, next) => {
    try {
        const { username, name, password } = request.body

        // password checks
        if (password === undefined) {
            response.status(400).send("Must provide password")
            return
        }

        if (password.length < 3) {
            response.status(400).send(`Password not long enough.  Got ${password.length} characters, need 3 or more.`)
            return
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            username,
            name,
            passwordHash
        })

        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch(exception) {
        next(exception)
    }
})





module.exports = userRouter