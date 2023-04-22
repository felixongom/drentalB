const express = require("express");
const { validateToken, upload_files } = require("./validateUser");
const House = require("../models/House");
const Payment =require('../models/Payment')
const Price =require('../models/Price')


const {
  houseSerilise,
  deleteImages,
  servicesFunc,
  priceFunction,
  addressFunction,
  timeLeft
} = require("./__functions");

const router = express.Router();

// add house
router.post("/", validateToken, async (req, res) => {
  const user = req.user; //to get the user details fro header
  const { name, description, phone, services, type } = req.body;

  //  check for dupicate
  if (!name || !description || !phone)
    return res.send({ messege: "please fill out all the field" });

  //making sure only admi post
  let files;
  let images = [];

  if (req.files) {
    files = req.files.files;
  }
  if (user.usertype !== "admin") return res.send("you must be admin to post");

  // single file
  if (files === undefined)
    return res.send("please choose images for your house");

  if (files.length == undefined) {
    images.push(await upload_files(files));
  } else {
    // upload multiple files
    for (let file of files) {
      images.push(await upload_files(file));
    }
  }

  // getting services
  const __services = servicesFunc(services);

  // grtting address
  const __address = addressFunction(req.body);

  // prices
  const __prices = priceFunction(req.body);

  let house = {
    user_id: user.id,
    name,
    description,
    images,
    address: __address,
    services: __services,
    prices: __prices,
    phone: phone.split(","),
    active: true,
    veiws:0,
    likes:0,
    approve: false,
    deleted: false,
    type,
  };
  // return res.send(house)

  const _house = new House(house);

  try {
    const saveHouse = await _house.save();
    res.send("created");


        // go ahead and give trial time in terms of Payment

        const payment = new Payment({
          houseId:saveHouse._id,
          userId:'trial', 
          active:true,
          amount:500,
          phone:234
        });
  
        try {
          const pay = await payment.save()
          // res.send(pay).status(200)
          console.log(pay);
          
        } catch (error) {
          console.log(error);
          
        }
        
  } catch (error) {
    res.send(error.messege);
    console.log(error.messege);
  }
});

// update
router.put("/:id", validateToken, async (req, res) => {
  const user = req.user; //to get the user details fro header

  const { id } = req.params;
  const { name, description, phone, services, type } = req.body;
  if (user.usertype !== "admin") return res.send("you must be admin to post");
  //  check for dupicate
  if (!name || !description || !phone) {
    return res.send("please fill out all the field" );
  }

  //making sure only admi post
  let files;
  let images = [];

  if (req.files) {
    files = req.files.files;
    // return res.send()

    if (files.length === undefined) {
      images.push(await upload_files(files));
    } else if (files.length > 0) {
      // upload multiple files
      for (let file of files) {
        images.push(await upload_files(file));
      }
    } else {
      images.push("");
    }
  }
  

  // getting services
  const __services = servicesFunc(services);

  // grtting address
  const __address = addressFunction(req.body);

  // prices
  const __prices = priceFunction(req.body);

  let house = {
    name,
    description,
    address: __address,
    services: __services,
    prices: __prices,
    type,
    phone: phone.split(","),
  };
   
  
  try {
    const img =  await House.findOneAndUpdate(
      {_id:id},
      {$push:{'images':{$each:images}}});
    
    // go aheade and update images
    const update= await House.findOneAndUpdate(
      { _id:id },
      {$set:{ ...house}}
      );

    res.send('updated')
  } catch (error) {
    // res.send(error.messege);
    console.log(error.messege);
  }
});

// fine all active, not deleted and approved  the houses
router.get("/", async (req, res) => {
  try {
    const pay = await Payment.find({active:true}).sort({createdAt:-1}) //get active payment
    const price = await Price.find().sort({createdAt:-1})[0]
    let priceRating = price?price[0]?.price:1000
    const houses = await House.find({
      deleted: false,
      active: true,
      approve: true,
    });
    const data = [];
     // cheching through the house 
     for (let house of houses) {
      const single_house = houseSerilise(house);
      data.push(single_house);

            // filtering to get amount
            const allPayments = pay.filter(el=>el.houseId==house._id) 
            const amountPayed = allPayments[0]?.amount
            
            // calculate time let and append to allPayments
            single_house.pay = allPayments?allPayments[0]?.amount:0
            single_house.amountpayed = allPayments?allPayments?.amount:10
            single_house.timeleft = timeLeft(amountPayed, priceRating)

    }

    // go ahead and update house to inactive
    for (let d of data ){
      if(d.amountpayed===0){
        await House.findOneAndUpdate({_id:d.id}, {$set:{active:false}})
       await Payment.findOneAndUpdate({houseId:d.id}, {$set:{active:false}})
      }

    }
    
    return res.send(data);
  } catch (error) {
    console.log(error);
  }
});

// fine all the houses
router.get("/everything", validateToken, async (req, res) => {
  try {
    const price = await Price.find().sort({createdAt:-1})
    const houses = await House.find().sort({ approve:1})
    const pay = await Payment.find({active:true}).sort({createdAt:-1})
    let priceRating = price?price[0]?.price:1000 //amount per month
    // console.log(pay); //amount per month
    

    const data = [];
    // cheching through the house
    for (let house of houses) {
      const single_house = houseSerilise(house);
      data.push(single_house);

      // filtering to get amount
      const allPayments = pay.filter(el=>el.houseId==house._id) 
      const amountPayed = allPayments[0]?.amount
      
      // calculate time let and append to allPayments
      single_house.pay = allPayments?allPayments[0]?.amount:0
      single_house.amountpayed = allPayments?allPayments?.amount:10
      single_house.timeleft = timeLeft(amountPayed, priceRating)

    }
    // go ahead and update house to inactive
    for (let d of data ){

      if(d.timeleft==='0 sec'){
        await House.findOneAndUpdate({_id:d.id}, {$set:{active:false}})
        await Payment.findOneAndUpdate({houseId:d.id}, {$set:{active:false}})
      }
    }
    return res.send(data);
  } catch (error) {
    console.log(error);
  }
});

// fine  house by id
router.get("/:id",  async (req, res) => {
  try {
    const pay = await Payment.find()
    const house = await House.findById(req.params.id);
    const price = await Price.find().sort({createdAt:-1})[0]
    let priceRating = price?price[0]?.price:1000

    if(!house){
      return res.send('no such house')
      
    } else{
      const single_house = house ? houseSerilise(house) : "404 not found";
           // filtering to get amount
           const allPayments = pay.filter(el=>el.houseId==house._id) 
           const amountPayed = allPayments[0]?.amount
           
           // calculate time let and append to allPayments
           single_house.pay = allPayments?allPayments[0]?.amount:0
           single_house.amountpayed = allPayments?allPayments?.amount:1000
           single_house.timeleft = timeLeft(amountPayed, priceRating)
      res.send(single_house);
    }
  } catch (error) {
    console.log(error); 
  }
});

// fine house by owner
router.post("/me", validateToken, async (req, res) => {
  const user = req.user;

  try {
    const pay = await Payment.find()
    const houses = await House.find({ user_id: user.id, deleted: false });
    const price = await Price.find().sort({createdAt:-1})[0]
    let priceRating = price?price[0]?.price:1000 //amount 


    const data = [];
    // cheching through the house
    for (let house of houses) {
      const single_house = houseSerilise(house);
      
           // filtering to get amount
           const allPayments = pay.filter(el=>el.houseId==house._id) 
           const amountPayed = allPayments[0]?.amount
           
           // calculate time let and append to allPayments
           single_house.pay = allPayments?allPayments[0]?.amount:0
           single_house.amountpayed = allPayments?allPayments?.amount:50
           single_house.timeleft = timeLeft(amountPayed, priceRating)
      
      data.push(single_house)
    }
    // go ahead and update house to inactive

    for (let d of data ){
      if(d.amountpaye<1){
        await House.findOneAndUpdate({_id:d.id}, {$set:{active:false}})
        await Payment.findOneAndUpdate({houseId:d.id}, {$set:{active:false}})
      }
    }
    
    
    res.send(data);
  } catch (error) {
    // console.log(error);
  }
});

// delete a house by id
router.delete("/delete/:id", validateToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  try {
    const house = await House.findById(req.params.id);
    if (house) {
      // check if is is house ouner and inactivate the house
      if (user.usertype === "admin") {
        const update = await House.updateOne({ _id: id }, {$set:{ deleted: true }});
        if (update) return res.send("deleted");
      } else {
        // go ahead delete all the images for the house
        deleteImages(house.images);

        // deleting house from db
        const deletehouse = await House.deleteOne(house._id);
        if (deletehouse) return res.send("deleted");
      }
    }
  } catch (error) {
    console.log(error);
  }
});



module.exports = router; 
