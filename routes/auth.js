const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const BASE_URL = require('../routes/__config')
const { sign } = require("jsonwebtoken");
const {
  validateUser,
  validateUserUpdate,
  validateToken,
  upload_files,
  
} = require("./validateUser");
const {userSerializer} = require('./__functions')
const router = express.Router();

// register
router.post("/register", async (req, res) => {
  // validating the fields
  // console.log(req.body);
  let error = validateUser(req.body)
  if(error.length>0)return res.send(error).status(400)
 
  const { name, email, phone, password, usertype } = req.body;

  // check for duplicate db registry
  const check = await User.findOne({ email, usertype });
  if (check) return res.status(400).send({ error: "user already exist" });
 
  // go on save user
  const salt = await bcrypt.genSalt(10); 
  const hashpassword = await bcrypt.hash(password, salt);
  const user = new User({
    name,
    email, 
    phone,
    usertype,
    password: hashpassword,
    active: 'active',
    avater: "",
  });

  try {

    await user.save();
    res.send(user).status(200);
  } catch (error) {
    res.status(400).send([error.messege]);
    console.log(error);
  }
});



// ............................................................................................................................................................................
// login
router.post("/login", async (req, res) => {
  
  const { email, password, usertype } = req.body;
  try {
    const user = await User.findOne({ email, usertype });
    if (!user) return res.send({ messege: "provide both valid email and password " });

    const vallidPassword = await bcrypt.compare(password, user.password);
    if (!vallidPassword)
      return res.send({ messege: "incorrect email or password" });


    const JWT_SECREATE ='this is the tolkken for the JWT of this application'
    const tokken = sign({ id: user._id, usertype }, JWT_SECREATE);
    res
      .header("tokken", tokken, { maxAge: 60 * 60 * 30 * 1000 }) //vallid for 30 days
      .send( tokken );
  } catch (messege) {
    res.send(messege);
  }
});
// ............................................................................................................................................................................

// get the authenticate user
router.get("/me", validateToken, async (req, res) => {
  const user = req.user;
  try {
    const exist = await User.findById(user.id);
    // return res.send(exist)
    if (!exist) return res.send({ error: "no such user user" });

    let doc = userSerializer(exist)
    res.send(doc);
  } catch (error) {
    console.log(error);
  }
});
  
// ............................................................................................................................................................................

// get one user
router.get("/user/:id", validateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.send({ error: "no such user exist" });

   let doc = userSerializer(user)

    res.send(doc);
  } catch (error) {
    console.log(error);
  }
});
// ............................................................................................................................................................................

// get all the user
router.get("/", validateToken, async (req, res) => {
  try {
    const users = await User.find().sort({usertype:-1}).sort({avater:-1});


    if (!users) return res.status(400).send({ error: "error finding users" });
    let user_list =[]
    for(let doc of users){
    

      // puseh to empty arrau
      user_list.push(userSerializer(doc))
    }

    return res.send(user_list);
  } catch (error) {
    res.send(error);
  }
});

// ............................................................................................................................................................................
// delete auser
router.delete("/:id", validateToken, async (req, res) => {
  const {usertype} = req.user
  if(usertype==='super admin'){

    try {
      
      const deleteUser = await User.deleteOne({ _id: req.params.id });
      if (!deleteUser) return res.status(400).send("failed");
      res.send("deleted");
    } catch (error) {
      console.log(error);
    }
  }else{
    res.send('Unauthorised action')
  }
});
// ............................................................................................................................................................................

// upate auser
router.patch("/", validateToken, async (req, res) => {
  const {id, usertype} = req.user
  if(usertype ==='admin'){

    
    const { name, email, phone} = req.body;
    try {
      // validating the fields
    validateUserUpdate(req.body);

    // find one and update
    let doc = await User.findOneAndUpdate({_id:id}, {name, email, phone}, {new:true});
    doc = {
      name: doc.name,
      email: doc.email,
      phone: doc.phone,
      
    }
    // delete doc.password
    return res.send(doc)
  } catch (error) {
    console.log(error);
  }
}else{
  res.send('400 bad request').status(400)
}
});
// upate auser
router.patch("/admin/:id", validateToken, async (req, res) => {
    const {id} = req.params
    const { name, email, phone} = req.body;
    try {
      // validating the fields
    validateUserUpdate(req.body);

    // find one and update
    let doc = await User.findOneAndUpdate({_id:id}, {name, email, phone}, {new:true});
    doc = {
      name: doc.name,
      email: doc.email, 
      phone: doc.phone,
      
    }
    // delete doc.password
    return res.send(doc)
  } catch (error) {
    console.log(error);
  }

});
// ............................................................................................................................................................................

// ............................................................................................................................................................................

// update user to be inative

router.patch('/active/:id', validateToken, async (req, res)=>{
  const user = req.user
  const id = req.params.id
  // return res.send({user,id})

  if(user.usertype === 'super admin'){
    const check = await User.findById(id)

    // chech the current active status
    const active = check.active == 'active'?'inactive':'active' 
    
    // go ahead updating user
    await User.findOneAndUpdate({_id:id},{$set:{active:active}}, {new:true});
    return res.send('Done') 
    


  }
  res.send('you cannot perform this action')

  


})

router.post('/avater', validateToken, async (req,res)=>{
  const {id} = req.user
  const file = req.files
  if(req.files){
    const avater = await upload_files(file.avater)

    // saving it to db
    const _avater = await User.updateOne({_id:id}, {$set:{avater}})

    console.log(_avater, _avater);
    res.send('sent').status(200);

  }else{
    res.send('no file')
  }

    
})


module.exports = router;
