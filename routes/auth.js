const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const {
  validateUser,
  validateUserUpdate,
  validateToken,
} = require("./validateUser");
const router = express.Router();

// register
router.post("/register", async (req, res) => {
  // validating the fields
  validateUser(req.body);

  const { name, email, phone, password, usertype } = req.body;

  // check for duplicate db registry
  const check = await User.findOne({ email, usertype });
  if (check) return res.status(409).send({ error: "user already exist" });

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
    res.send('created').status(201);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});
// ............................................................................................................................................................................
// login
router.post("/login", async (req, res) => {
  const { email, password, usertype } = req.body;
  try {
    const user = await User.findOne({ email, usertype });
    if (!user) return res.send({ messege: "no such user exist" });

    const vallidPassword = await bcrypt.compare(password, user.password);
    if (!vallidPassword)
      return res.send({ messege: "incorrect email or password" });

    const tokken = sign({ id: user._id, usertype }, process.env.JWT_SECREATE);
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
    if (!exist) return res.send({ error: "no such user user" });

    let doc = {
      _id: exist._id,
      name: exist.name,
      email: exist.email,
      phone: exist.phone,
      active: exist.active,
      avater: exist.avater,
      usertype: exist.usertype,
      createdAt: exist.createdAt,
      updatedAt: exist.updatedAt,
    }
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

   let doc = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      active: user.active,
      avater: user.avater,
      usertype: user.usertype,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    res.send(doc);
  } catch (error) {
    console.log(error);
  }
});
// ............................................................................................................................................................................

// get all the user
router.get("/users", validateToken, async (req, res) => {
  try {
    const users = await User.find();


    if (!users) return res.status(400).send({ error: "error finding users" });
    let user_list =[]
    for(let doc of users){
      let obj ={}
      obj._id = doc._id,
      obj.name = doc.name,
      obj.email = doc.email,
      obj.phone = doc.phone,
      obj.active = doc.active,
      obj.avater = doc.avater,
      obj.usertype = doc.usertype,
      obj.createdAt = doc.createdAt,
      obj.updatedAt = doc.updatedAt,

      // puseh to empty arrau
      user_list.push(obj)
    }

    return res.send(user_list);
  } catch (error) {
    res.send(error);
  }
});

// ............................................................................................................................................................................
// delete auser
router.delete("/delete/:id", validateToken, async (req, res) => {
  try {
    const deleteUser = await User.deleteOne({ _id: req.params.id });
    if (!deleteUser) return res.status(400).send("failed");
    res.send("success");
  } catch (error) {
    console.log(error);
  }
});
// ............................................................................................................................................................................

// upate auser
router.put("/update", validateToken, async (req, res) => {
  const { id, name, email, phone, usertype, active } = req.body;
  try {
    // validating the fields
    validateUserUpdate(req.body);

    // find one and update
      let doc = await User.findOneAndUpdate({_id:id}, {name, email, phone, usertype, active}, {new:true});
      doc = {
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        active: doc.active,
        avater: doc.avater,
        usertype: doc.usertype,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
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

// router.patch('/active/:id', validateToken, async (req, res)=>{
//   const user = req.user
//   const id = req.params.id
//   return res.send({user,id})

//   if(user.usertype === 'admin'){
//     const check = await User.findById(id)

//     // chech the current active status
//     const active = check.active == true?false:true 

//     // go ahead updating user
//     let doc = await User.findOneAndUpdate({_id:id},{usertype:active}, {new:true});
//     return res.send(doc).status(201)


//   }
//   res.send({error:'you cannot perform this action'})

  


// })

module.exports = router;
