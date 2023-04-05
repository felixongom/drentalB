const express = require('express')
const router = express.Router()
const {validateToken } = require('./validateUser')
const Payment =require('../models/Payment')
const House = require('../models/House')

router.post('/:hid',validateToken, async (req, res)=>{

  // if the payment is active
  
  
  const {id} = req.user
  const {hid} = req.params
  const {amount} = req.body

  const pay = await Payment.find({houseId:hid, active:true}).sort({createdAt:-1}) //get active payment
  if(pay.length>0){
    const newamount = pay[0].amount+parseInt(amount)  
    await Payment.updateOne({_id:pay[0]._id}, {$set:{amount:newamount}})
    const updateHouse = await House.updateOne({_id:hid},{$set:{active:true}})
    return res.send({pay, newamount})
    
  }else{

    // just pay
    const payment = new Payment({
      houseId:hid,
      userId:id, 
      active:true,
      amount,
      phone:234
      });
      
      try {
        const pay = await payment.save()
        const updateHouse = await House.findByIdAndUpdate({_id:hid},{$set:{active:true}},{new:true})
        console.log(updateHouse);
        res.send(pay).status(200)
        
      } catch (error) {
        console.log(error);
        
      }

    }
})
router.get('/:hid',validateToken, async (req, res)=>{

    const {hid} = req.params
      try {
        const pay = await Payment.findById(hid)
        if(pay){
            res.send(pay).status(200)

        }else{
            {}
        }
        
      } catch (error) {
        console.log(error);
        
      }

})

module.exports = router
