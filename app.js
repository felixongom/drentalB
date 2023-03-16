const express = require('express');
const mongoose = require('mongoose');
const cookiePaser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const cors = require('cors')
const auth = require('./routes/auth')
const house = require('./routes/house');
const Image = require('./routes/Image');
const services = require('./routes/services')

const app = express()
require('dotenv').config()

// connection
mongoose.connect(process.env.DB)

//set static folder
app.use(express.static('public'))
app.use('/uploads', express.static('uploads')) 

// middlewares
app.use(express.json()) 
app.use(cookiePaser())
app.use(fileUpload())
app.use(cors())

// routes
app.use('/api/user', auth)
app.use('/api/house', house)
app.use('/api/image', Image)
app.use('/api/services', services)


const PORT =process.env.PORT
app.listen(PORT, console.log(`App is listenin on ${PORT}`))
