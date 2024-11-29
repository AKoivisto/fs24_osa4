const _ = require('lodash')

const dummy = (blogs) => {
    return 1    
}

const totalLikes = (blogs) => {
    return blogs.reduce((summa, blog) => summa+blog.likes,0)
    }

const favoriteBlog = (blogs) => {
    const mostLikes = blogs.reduce((max, blog) =>
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

    return topWriter
}

const mostLikes = (blogs) => {

    let likedWriter = _(blogs)
    .groupBy('author')
    .map((blogs, author) => ({author, sum_Likes: _.sumBy(blogs, 'likes') }))
    .maxBy('sum_Likes')


    result = {
        author: likedWriter.author,
        likes: likedWriter.sum_Likes

    }

    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

