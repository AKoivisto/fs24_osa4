const _ = require('lodash')

const dummy = (blogs) => {
    return 1    
}

const totalLikes = (blogs) => {
    return blogs.reduce((summa, blog) => summa+blog.likes,0)
    }

const favoriteBlog = (blogs) => {
    mostLikes = blogs.reduce((max, blog) =>
        blog.likes > max.likes ? blog : max)
    const toReturn = {
        title: mostLikes.title,
        author: mostLikes.author,
        likes: mostLikes.likes,
    }
    return toReturn
}

const mostBlogs = (blogs) => {
    const topWriter = _(blogs)
    .groupBy('author')
    .map((blogs,author) => ({author, count: blogs.length}))
    .maxBy('count')
    console.log(topWriter)
    return topWriter
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}

