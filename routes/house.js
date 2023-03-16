const express = require("express");
const fs = require("fs");
const { validateToken, upload_files } = require("./validateUser");
const House = require("../models/House");
const { houseSerilise, deleteImages } = require("./__functions");

const router = express.Router();

// add house
router.post("/", validateToken, async (req, res) => {
  const user = req.user; //to get the user details fro header
  const { name, description, phone } = req.body;

  // check for dupicate
  if (!name || !description || !phone)
    return res.send({ messege: "please fill out all the field" });

  //making sure only admi post
  if (user.usertype !== "admin") return res.send("you must admin to post");

  let images = [];
  const files = req.files.files;

  // sngle file
  if (files.length == undefined) {
    images.push(await upload_files(files));
  } else {
    // ultipe file
    for (let file of files) {
      images.push(await upload_files(file));
    }
  }

  let house = {
    user_id: user.id,
    name,
    description,
    images,
    phone,
    active: true,
    approve: false,
  };
  // return res.send(house)

  const _house = new House(house);

  try {
    const saveHouse = await _house.save();
    res.send(saveHouse.images);
  } catch (error) {
    res.send(error.messege);
    console.log(error.messege);
  }
});

// house house
router.patch("/", validateToken, async (req, res) => {
  const { skill_id, my_skill, description, duration } = req.body;
  // check for empty fields
  if (skill_id == "" || my_skill == "" || description == "" || duration == "")
    return res.status(400).send({ mesege: "fill out all the fields" });

  const skill = new Skill({ my_skill, description, duration });

  try {
    const updatSkill = await skill.updateOne(
      { _id: skill_id },
      {
        my_skill,
        description,
        duration,
      }
    );
    res.send(updatSkill);
  } catch (error) {
    // res.send(error)
    console.log(error);
  }
});

// fine all the house
router.get("/", async (req, res) => {
  try {
    const houses = await House.find();
    const data = [];
    // cheching through the house
    for (let house of houses) {
      const single_house = houseSerilise(house);
      data.push(single_house);
    }
    return res.send(data);
  } catch (error) {
    console.log(error);
  }
});

// fine  house by id
router.get("/:id", async (req, res) => {
  try {
    const house = await House.findById(req.params.id);
    const single_house = house ? houseSerilise(house) : "404 not found";
    res.send(single_house);
  } catch (error) {
    console.log(error);
  }
});

// fine house by owner
router.post("/owner", validateToken, async (req, res) => {
  const user = req.user;
  console.log(user);

  try {
    const house = await House.findOne({ user_id: user.id });
    const single_house = house ? houseSerilise(house) : [];
    res.send(single_house);
  } catch (error) {
    // console.log(error);
  }
});

// delete a house by id
router.delete("/delete/:id", validateToken, async (req, res) => {
  const user = req.user;

  try {
    const house = await House.findById(req.params.id);
    if (house) {
      // check if is is house ouner and inactivate the house
      if (user.usertype === "admin") {
        const update = await House.updateOne({ approve: false });
        if (update) return res.send("deleted");
      } else {
        // go ahead delete all the images for the house
        deleteImages(house.images);
        
        // deleting house from db
        const deletehouse = await House.deleteOne(house._id);
        if (deletehouse) return res.send('deleted')
            
      }

    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
