const express = require("express");
const uuid = require("uuid").v4;

const { validateToken } = require("./validateUser");
const House = require("../models/House");
const User = require("../models/User");
const { route } = require("./auth");
const router = express.Router();


// to add abject of services int o services array
router.post("/:id", async (req, res) => {
  const { services } = req.body;
  const { id } = req.params;

  // convert the csv to object of services to add id and time
  let servisArray = services.split(",");

  let _services = [];
  for (let service of servisArray) {
    let serviceobj = { id: uuid(), service, date: Date.now() };

    _services = [..._services, serviceobj];
  }

  //   get and update
  try {
      await House.findOneAndUpdate(
        {_id:id},
        {$push:{'services':{$each:_services}}});

      res.send('updated') 
      
  } catch (error) {
      console.log(error);
      
  }
})

// deleting services from
router.delete('/:id/:service', validateToken, async (req, res)=>{
    const {id, service} = req.params

    try {
        const deleteH = await House.findOneAndUpdate(
            {_id:id},
            {$pull:{'services':{id:service}}},
          
        )
        res.send('deleted')
    } catch (error) {
        console.log(error);
    }

}) 

module.exports = router
