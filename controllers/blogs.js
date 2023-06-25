const blogRouter = require('express').Router()
const {Blog} = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 }, "User")
        response.json(blogs)
    } catch(exception) {
        next(exception)
    }
})
  
blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {
    const body = request.body

    // find token
    try {
        const user = request.user
    
        const blog = new Blog({
            ...body,
            user: user.id
        })
        blog.likes = blog.likes === undefined ? 0 : blog.likes

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)

    } catch(error) {
        next(error)
    }
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    try {
        // find blog and user
        const blog = await Blog.findById(request.params.id)
        const user = request.user

        // verify user is able to delete this blog
        if (blog.user.toString() !== user._id.toString()) {
            response.status(401).json({
                "error":"User cannot delete other user's blogs."
            })
        }

        const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
        response.status(200).send(deletedBlog)

    } catch(error) {
        next(error)
    }
})

blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const updatedBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
        response.status(200).send(updatedBlog)
    } catch(exception) {
        next(exception)
    }
})

module.exports = blogRouter