
const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
  {
    title: 'test tests',
    author: 'tester',
    url: 'test.test.test2',
    likes: 3
  },
  {
    title: 'test tests 3',
    author: 'tester 32',
    url: 'test.test.test22',
    likes: 18
  },
  {
    title: 'test tests1',
    author: 'tester3',
    url: 'test.test.test22',
    likes: 13
  }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {initialBlogs, blogsInDb, usersInDb}