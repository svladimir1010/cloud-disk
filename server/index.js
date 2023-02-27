const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const authRouter = require('./routes/auth.routes')
const fileRouter = require('./routes/file.routes')
const fileUpload = require('express-fileupload')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT
const UrI = process.env.MONGODB_URL
const corsMiddleware = require('./middleware/cors.middleware')
const filePathMiddleware = require('./middleware/filepath.middleware')
const cors = require('cors')


app.use(cors({
  origin: '*'
}));

app.use(fileUpload({}))
app.use(corsMiddleware)
app.use(filePathMiddleware(path.resolve(__dirname, 'files')))
app.use(express.json())
app.use(express.static('static'))
app.use('/api/auth', authRouter)
app.use('/api/files', fileRouter)

const start = async() => {
  try {
    mongoose.connect(UrI, {useNewUrlParser: true, useUnifiedTopology: true})
    app.listen(PORT, () => console.log('Server listening on port: ', PORT))
  } catch( err ) {
    console.log('Error MESSAGE: ', err.message)
  }
}
start()
