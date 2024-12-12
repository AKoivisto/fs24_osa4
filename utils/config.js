require('dotenv').config()

//const password = process.env.SALIS
const PORT=process.env.PORT
//const MONGODB_URI = `mongodb+srv://anttonvkoivisto:${password}@phonebook-backend.608sw.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Phonebook-backend`
//const TEST_MONGODB_URI = `mongodb+srv://anttonvkoivisto:${password}@phonebook-backend.608sw.mongodb.net/testbloglist?retryWrites=true&w=majority&appName=Phonebook-backend`

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
}