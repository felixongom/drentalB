const express = require("express");

const { validateToken } = require("./validateUser");
const House = require("../models/House");
const router = express.Router();
const {servicesFunc} = require('./__functions')


// to add abject of services int o services array
router.post("/:id", async (req, res) => {
  const { services } = req.body;
  const { id } = req.params;

  // convert the csv to object of services to add id and time
 const _services = servicesFunc(services)

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
