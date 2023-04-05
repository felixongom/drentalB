const express = require('express')
const router = express.Router()
const {validateToken } = require('./validateUser')
const Price =require('../models/Price')


router.post('/', validateToken, async (req, res)=>{
    const {usertype} = req.user
    try {
        if(usertype==='super admin'){

            const b=req.body
            const price = new Price({price:b.price})
            const __price = price.save()
            res.json(__price)
        }else{
            res.json( 'unauthorised action' )
        }
    } catch (error) {
        console.log(error);
        
    }
})

router.get('/',validateToken, async (req, res)=>{
    try {
        const price = await Price.find().sort({createdAt:-1})
        return res.send(price[0])
    } catch (error) {
        console.log(error); 
        
    }

})   
module.exports = router; 
