
const Blog = require('../models/blog')


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


module.exports = {initialBlogs, blogsInDb}