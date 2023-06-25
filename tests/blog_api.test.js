const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const {Blog} = require('../models/blog')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')

let token = ''

beforeAll(async () => {
    //create user
    const loggedUser = await api
    .post('/api/users')
    .send({
        username:"user",
        name:"User",
        password:"password"
    })

    const response = await api
    .post('/api/login')
    .send({
        username: "user",
        password: "password"
    })

    console.log(response)

    token = response.body.token
})

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const blogPromises = blogObjects.map(blog => blog.save())
    await Promise.all(blogPromises)
})

describe("basic GET/POST functionality", () => {
    test("GET returns the right number of blogs", async () => {
        const response = await api.get("/api/blogs").expect(200)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test("unique identifier called id", async () => {
        const response = await api.get("/api/blogs")
        expect(response.body[0].id).toBeDefined()
    })
    
    test("post works as intended", async () => {
        const newBlog = {
            title: "Third post",
            author: "Garrett",
            url: "google.com",
            likes: 42
        }
    
        await api
        .post('/api/blogs')
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)
    
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(contents).toContain("Third post")
    }, 20000) //slow because mongo sucks ass
})


describe("behavior when a prorperty is omitted", () => {
    test("0 likes as default", async () => {
        const newBlog = {
            title: "New post",
            author: "Garrett",
            url: "google.com",
        }
    
        await api
        .post('/api/blogs')
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)
    
        const response = await api.get('/api/blogs')
        const contents = response.body.filter(r => r.title === "New post")[0]
    
        expect(contents.likes).toEqual(0)
    }, 20000)
    
    test("API rejects posts without title", async () => {
        const newBlog = {
            author: "Garrett",
            url: "google.com",
            likes: 420
        }
    
        await api
        .post('/api/blogs')
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 20000)
    
    test("API rejects posts without url", async () => {
        const newBlog = {
            title: "I am so retarded",
            author: "Garrett",
            likes: 420
        }
    
        await api
        .post('/api/blogs')
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 20000)
})

describe("delete works", () => {
    test("delete length matches", async () => {
        const newBlog = {
            title: "I am so retarded",
            author: "Garrett",
            url:"google.com",
            likes: 420
        }
    
        await api
        .post('/api/blogs')
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/)
    
        let response = await api.get('/api/blogs')
        const newID = response.body.filter(r => r.title === "I am so retarded")[0].id

        await Blog
        .findByIdAndDelete(newID)

        response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 20000)
})

describe("updating works as expected", () => {
    test("delete length matches", async () => {
        const newBlog = {
            title: "First post",
            author: "Garrett",
            url:"google.com",
            likes: 420
        }

        let response = await api.get('/api/blogs')
        const newID = response.body.filter(r => r.title === "First post")[0].id
    
        await api
        .put(`/api/blogs/${newID}`)
        .send(newBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/)

        response = await api.get('/api/blogs')
        const updatedLikes = response.body.filter(r => r.title === "First post")[0].likes
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
        expect(updatedLikes).toEqual(420)
    }, 20000)
})

describe("token auth", () => {
    test("cannot post new blog without token", async () => {
        const newBlog = {
            title: "Third post",
            author: "Garrett",
            url: "google.com",
            likes: 42
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 20000)
})

afterAll(async () => {
    await mongoose.connection.close()
})