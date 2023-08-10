const express = require("express");
const { validateToken, upload_files } = require("./validateUser");
const Booking = require("../models/Booking");
const House = require("../models/House");
const User = require("../models/User");

const {maileSender} = require('../mails/mails')

const {
  houseSerilise,
  houseobj
} = require("./__functions");
const { findByIdAndUpdate } = require("../models/House");

const router = express.Router();

// booking the house
router.post("/", validateToken, async (req, res) => {
  const { houseId, bookeePhone, price, houseOwner} = req.body;
  const { id, usertype } = req.user;


  if (usertype !== "client") return res.send({ error: "unauthorize account" });
  if (!houseId || !bookeePhone || !price || !houseOwner) return res.send({ error: "supply all the fields" });

  const booking = new Booking({
    bookeeId: id,
    bookeePhone: bookeePhone,
    houseId,
    houseOwner,
    price: price.price1, 
    duration: price.per1,
    active: true,
  });
  const __booking = await booking.save();
  res.send(__booking);

  // looking into sending email
  const user = await User.findById(id) 
  const bookedHouse = await House.findById(houseId)
  const bookedHouseowner = await User.findById(houseOwner)
  

  // return console.log(bookedHouseowner)
  const sendToClient = user.email
  const sendToHouseOwner = bookedHouseowner.email
  const mailMessege = `You have booked a room at ${bookedHouse.name}, your booking has been confirmed`
  const houseOwnerMesseg = `Hi, ${user.name}, Email: ${sendToClient} has just booked one room at ${bookedHouse.name}`

  // sending email to client
  maileSender(sendToClient, mailMessege, 'Thanks for your Booking')

  // sending email to house owner
  maileSender(sendToHouseOwner, sendToHouseOwner, houseOwnerMesseg)

});

// finging all the booking from the db
router.get("/", validateToken, async (req, res) => {
  // return console.log(req.user)
  let bookings = []
  const {usertype, id}=req.user; 
  const houses = await House.find();
  const customer = await User.find();

  if(usertype==='admin'){ 
    bookings = await Booking.find({houseOwner:id}).sort({ createdAt: -1 });
  }else if(usertype==='super admin'){
    bookings = await Booking.find().sort({ createdAt: -1 });

  }

  const result = [];
  for (let booking of bookings) {
    for(let custom of customer){
      if(booking.bookeeId==custom._id){
        let newHouses = houses.find((house) => house._id == booking.houseId);
    
        // return house
        let person ={name:custom.name, avater:custom.avater, phone:custom.phone, email:custom.email}
        const returnHouse = { booking, customer:person, houses:newHouses===undefined?houseobj:houseSerilise(newHouses)};
        result.push(returnHouse);
      }
    }
  }
  res.send(result);
});
// finging all my  booking from the db that belongs to one person
router.get("/me", validateToken, async (req, res) => {
  const { usertype, id } = req.user;

  let bookings
  let houses;

  if (usertype === "client") {
    bookings = await Booking.find({ bookeeId: id })
    .limit(5)
    .sort({ createdAt: -1 });
    
    houses = await House.find().sort({ createdAt: -1 });
  }
  
  const result = [];

  for (let booking of bookings) {
    let newHouses = houses.find((house) => house._id == booking.houseId);
   //getting for aspacifict person
    

    // return house
    const returnHouse = { booking, houses:newHouses===undefined?houseobj:houseSerilise(newHouses) };
    // console.log(newHouses);
    result.push(returnHouse);
  }
  res.send(result);

});

module.exports = router;
