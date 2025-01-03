const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

// beforeEach(async () => {
// await Blog.deleteMany({})

// await Blog.insertMany(helper.initialBlogs)
// })

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

test('bloggs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

test('How many blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, 3)
  })

  test('id, not _id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
        assert.ok(blog.id)
        assert.strictEqual(blog._id, undefined)
      });

  })

  test('add blogs', async () => {

    const newBlog = {
      title: 'test tests',
      author: 'tester',
      url: 'test.test.test2',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.content)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)


  })

  after(async () => {
    await mongoose.connection.close()
  })