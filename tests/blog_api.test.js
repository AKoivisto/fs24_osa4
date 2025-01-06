const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('Blog tests', () => {

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

test('blogs are returned as json', async () => {
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
      title: 'test tests 25',
      author: 'tester 5',
      url: 'test.test.test22',
      likes: 322
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

  test('likes = 0', async () => {
    const newBlog2 = {
      title: 'test tests 25',
      author: 'tester 5',
      url: 'test.test.test22',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog2)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const postedBlog = response.body

    assert.strictEqual(postedBlog.likes, 0)
  })

  test('if no title or url, 400 bad request', async () => {
    const newBlog = {
      author: 'tester 5',
      url: 'test.test.test22',
    }

    const newBlog2 = {
      title: 'tester 5',
      author: 'test.test.test22',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .expect(400)

    const response2 = await api.get('/api/blogs')

    assert.strictEqual(response2.body.length, helper.initialBlogs.length)
  })

  test('delete  one blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    //console.log(blogsAtStart)
    const toDelete = blogsAtStart[0]
    //console.log(toDelete.id)

    await api
    .delete(`/api/blogs/${toDelete.id}`)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    //console.log(blogsAtEnd)
    
    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(toDelete.title))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length -1)

  })

  test('edit blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const toEdit = blogsAtStart[0]

    const editedBlog = {
      title: 'Edited Test',
      author: 'tester',
      url: 'test.test.test2',
      likes: '4'
    }

    await api
    .put(`/api/blogs/${toEdit.id}`)
    .send(editedBlog)
    .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[0].likes, 4)
    assert.strictEqual(blogsAtEnd[0].title, 'Edited Test')


  })
})
  describe('One user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('salis', 10)
      const user = new User({ username: 'root', passwordHash})
    
      await user.save()
    })

    test('created a new username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'antkoi',
        name: 'Antti Koivula',
        password: 'topsecret',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        // console.log(newUser.username)
        assert(usernames.includes(newUser.username))
    })

    test('user creation fails, if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'root 2',
        password: 'passwords',
      }

      const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails, if username too short', async () => {
      const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'ro',
          name: 'too short',
          password: 'passwordsyeye',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails, if password too short', async () => {
      const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'rootti',
          name: 'too short password',
          password: 'po',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails, if password is missing', async () => {
      const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'passwordtester',
          name: 'No Password',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation fails, if username is missing', async () => {
      const usersAtStart = await helper.usersInDb()

        const newUser = {
          name: 'No User Name',
          password: 'noname',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })


  after(async () => {
    await mongoose.connection.close()
  })