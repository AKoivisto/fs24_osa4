require('dotenv').config()

const password = process.env.SALIS
const PORT=process.env.PORT
const MONGODB_URI = `mongodb+srv://anttonvkoivisto:${password}@phonebook-backend.608sw.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Phonebook-backend`

module.exports = {
    MONGODB_URI,
    PORT
}