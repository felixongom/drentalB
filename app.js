const express = require('express');
const mongoose = require('mongoose');
const cookiePaser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const cors = require('cors')
const auth = require('./routes/auth')
const house = require('./routes/house');
const modify = require('./routes/modify');
const payment = require('./routes/payment');
const price = require('./routes/price');
const booking = require('./routes/booking');
// const Image = require('./routes/Image');
const services = require('./routes/services')

const app = express()
require('dotenv').config()

// connection
const DB_NETWORK ='mongodb+srv://felixz:317111@cluster0.ujknwfv.mongodb.net/?retryWrites=true&w=majority'
const DB_LOCAL = process.env.DB

mongoose.connect(DB_NETWORK, (err, res)=>{
    if(err){console.log(err)}

    console.log('connected');
})

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
app.use('/api/modify', modify)
app.use('/api/payment', payment) 
app.use('/api/booking', booking) 
app.use('/api/price', price)
// app.use('/api/image', Image)
app.use('/api/services', services)      



const PORT =process.env.PORT ||5000
app.listen(PORT, console.log(`App is listenin on ${PORT}`))
