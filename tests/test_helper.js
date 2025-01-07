
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')


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

const testUser = {
  username: 'talo',
  password: 'tanelinsalis',
}

const newUserLogin = async () => {
  const newUser = {
    username: 'talo',
    name: 'Taneli Lohi',
    password: 'tanelinsalis',
  }
  const passwordHash = await bcrypt.hash(newUser.password, 10)
  const user = new User({
    username: newUser.username,
    name: newUser.name,
    passwordHash
  })
  await user.save()

}

module.exports = {initialBlogs, blogsInDb, usersInDb, newUserLogin, testUser}