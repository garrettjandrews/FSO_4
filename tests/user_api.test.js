const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

// before each test, delete all users from the DB
beforeEach(async () => {
    await User.deleteMany({})

    const users = helper.initialUsers.map(async user => {
        const passwordHash = await bcrypt.hash(user.password, 10)
        const newUser = new User({
            username: user.username,
            name: user.name,
            passwordHash: passwordHash
        })
        await newUser.save()
    })
    await Promise.all(users)
})

describe("basic functionality", () => {
    test("GET", async () => {
        const response = await api.get('/api/users').expect(200)
        expect(response.body).toHaveLength(helper.initialUsers.length)
    })
})

describe("User/password validations", () => {
    test("Username under 3 characters doesn't work", async () => {
        const newUser = {
            username: "hi",
            name: "admin",
            password: "password"
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.initialUsers.length)
    }, 20000)

    test("missing username doesn't work", async () => {
        const newUser = {
            name: "admin",
            password: "password"
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/)

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.initialUsers.length)
    }, 20000)

    test("duplicate username doesn't work", async () => {
        const newUser = {
            username: "garrettandrews",
            name: "admin",
            password: "password"
        }

        const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

        expect(postResponse.text).toContain('unique')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.initialUsers.length)
    }, 20000)

    test("missing password doesn't work", async () => {
        const newUser = {
            username: "newUser",
            name: "admin"
        }

        const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        expect(postResponse.text).toContain('Must provide password')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.initialUsers.length)
    }, 20000)

    test("pw less than 3 chars doesnt work", async () => {
        const newUser = {
            username: "newUser",
            name: "admin",
            password: "hi"
        }

        const postResponse = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        expect(postResponse.text).toContain('not long enough')

        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(helper.initialUsers.length)
    }, 20000)
})


afterAll(async () => {
    await mongoose.connection.close()
})








