const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    }
    else {
        response.status(404).end()
    }
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })

    try {
        const savedBlog = await blog.save()
        await savedBlog.populate('user', { username: 1, name: 1, id: 1})
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    } catch (error) {
        response.status(400).json({error: 'Title or url missing'})
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        .populate('user', {username: 1, name: 1, id: 1})
    response.json(updatedBlog)

})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() !== user.id) {
        return response.status(403).json({ error: 'unauthorized' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})



module.exports = blogsRouter

  