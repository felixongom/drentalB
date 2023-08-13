const express = require("express");
const { validateToken, upload_files } = require("./validateUser");
const House = require("../models/House");
const User = require("../models/User");

const {
  houseSerilise,
  deleteImages,
  servicesFunc,
  priceFunction,
  addressFunction,
} = require("./__functions");

const {maileSender} = require('../mails/mails')
const { findByIdAndUpdate } = require("../models/House");

const router = express.Router();

// approving the house 
router.patch('/:id/:approved',validateToken, async (req, res)=>{
  const {id, approved} = req.params
  const {usertype} = req.user
  const status = approved==='true'?false: true
  

   if(usertype !=='super admin') return res.send('unaouthorised action')
 try {
     const update = await House.findOneAndUpdate({_id:id},{$set:{approve:status}} )
     res.send(`${status?'Approved':'Disapproved'}`)
    //  console.log(update);
    // sending mail for approval
    const findtheHouse = await House.findById(id)
    const findthOwner = await User.findOne({_id:findtheHouse.user_id})
    
    const state = approved==='true'?'approved': 'removed'
    const mailMessege = `Your house, ${findtheHouse.name} has been ${state}`

    maileSender(findthOwner.email, mailMessege)
    
 } catch (error) {
    console.log(error);
    
 }

  } )

  // increamenting  views
  router.post('/views/:id', async (req, res)=>{
    const {id}= req.params
    try {
      
      const find = await House.findById(id)
      
      const veiws = find.veiws+1
      await House.updateOne({_id:id}, {$set:{veiws:veiws}})
      res.send('viwed')
    } catch (error) {
      console.log(error);
      
    }
    
  })

  // increamenting  likes
  router.get('/likes/:id', async (req, res)=>{
    const {id}= req.params
    try {
      
      const find = await House.findById(id)
  
      const likes = find.likes+1
      await House.updateOne({_id:id}, {$set:{likes:likes}})
      res.send({m:'liked', id})
    } catch (error) {
      console.log(error);
      
    }

  })


  // deleting images of the house
  router.delete('/image/:Hid/:name', async (req, res)=>{
    const {Hid, name} = req.params
    console.log(req.params);

    // delete the image from the database
    try {
      const deleteImage = await House.findOneAndUpdate({_id:Hid}, {$pull:{images:name}})
      if(deleteImage){
        deleteImages([name])
      }
      res.send('deleted') 
    } catch (error) {
console.log(error);      
    }
  })


  module.exports = router; 