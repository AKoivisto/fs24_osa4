const dummy = (blogs) => {
    return 1    
}

const totalLikes = (blogs) => {
    return blogs.reduce((summa, blog) => summa+blog.likes,0)
    }

module.exports = {
    dummy,
    totalLikes
}