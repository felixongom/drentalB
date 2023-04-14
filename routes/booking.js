const express = require("express");
const { validateToken, upload_files } = require("./validateUser");
const Booking = require("../models/Booking");
const House = require("../models/House");
const {
  houseSerilise,
  priceFunction,
  addressFunction,
} = require("./__functions");
const { findByIdAndUpdate } = require("../models/House");
const User = require("../models/User");

const router = express.Router();

// approving the house
router.post("/", validateToken, async (req, res) => {
  const { houseId, bookeePhone, price } = req.body;
  const { id, usertype } = req.user;

  if (usertype !== "client") return res.send({ error: "unauthorize account" });

  const booking = new Booking({
    bookeeId: id,
    bookeePhone: bookeePhone,
    houseId,
    price: price.price1,
    duration: price.per1,
    active: true,
  });
  const __booking = await booking.save();
  res.send(__booking);
});

// finging allthe booking from the db
router.get("/", validateToken, async (req, res) => {
  const bookings = await Booking.find();
  const houses = await House.find();
  const customer = await User.find();

  const result = [];
  for (let booking of bookings) {
    for(let custom of customer){
      if(booking.bookeeId==custom._id){
        const newHouses = houses.filter((house) => house._id == booking.houseId)[0];
    
        // return house
        let person ={name:custom.name, avater:custom.avater, phone:custom.phone, email:custom.email}
        const returnHouse = { booking, houses: newHouses, customer:person };
        result.push(returnHouse);
      }
    }
  }
  res.send(result);
});
// finging all my booking from the db
router.get("/me", validateToken, async (req, res) => {
  const { usertype, id } = req.user;

  const bookings = await Booking.find({ bookeeId: req.user.id })
    .limit(5)
    .sort({ createdAt: -1 });
  let houses;

  if (usertype === "admin") {
    houses = await House.find({ user_id: id }).sort({ createdAt: -1 }); //getting for aspacifict person
  } else {
    houses = await House.find().sort({ createdAt: -1 }); //geting all
  }

  const result = [];
  for (let booking of bookings) {
    const newHouses = houses.filter((house) => house._id == booking.houseId)[0];

    // return house
    const returnHouse = { booking, houses: houseSerilise(newHouses) };
    result.push(returnHouse);
  }
  res.send(result);
});

module.exports = router;
