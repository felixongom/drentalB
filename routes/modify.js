const express = require("express");
const { validateToken, upload_files } = require("./validateUser");
const House = require("../models/House");
const {
  houseSerilise,
  deleteImages,
  servicesFunc,
  priceFunction,
  addressFunction,
} = require("./__functions");
const { findByIdAndUpdate } = require("../models/House");

const router = express.Router();

// approving the house 
router.patch('/:id/:approved',validateToken, async (req, res)=>{
    const {id, approved} = req.params
    const {usertype} = req.user
    const status = approved===true?false: true

   if(usertype !=='super admin') return res.send('unaouthorised sction')
 try {
     const update = await House.findOneAndUpdate({_id:id},{$set:{approve:status}} )
     res.send('approved')
    //  console.log(update);
    
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


  router.delete('/image', async (req, res)=>{
    // const {id} = req.body
    console.log(req.body);
    res.send(req.body)
  })


  module.exports = router; 