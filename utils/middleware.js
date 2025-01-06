const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.message.includes('E11000')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }
  
    next(error)
  }

  module.exports = errorHandler