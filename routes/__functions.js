const BASE_URL = require("./__config");
const { timeAgo } = require("./validateUser");
const uuid = require("uuid").v4;
const fs = require('fs');

const getImagesUrl = (img) => {
  let newurl = [];
  for (let i of img) {
    newurl = [...newurl, BASE_URL + "uploads/" + i];
  }
  return newurl;
};

//
// serialise houser
const houseSerilise = (house) => {
  const single_house = {};
  single_house.id = house._id;
  single_house.name = house.name; 
  single_house.user_id = house.user_id;
  single_house.approve = house.approve;
  single_house.active = house.active;
  single_house.type = house.type; 
  single_house.images = house.images ? getImagesUrl(house.images) : "";
  single_house.services = house.services;
  single_house.description = house.description;
  single_house.address = house.address;
  single_house.phone = house.phone;
  single_house.prices = house.prices;
  single_house.createdAt = house.createdAt;
  single_house.views = house.views;
  single_house.likes = house.likes;
  single_house.deleted = house.deleted;
  single_house.added = timeAgo(house.createdAt);

  return single_house;
};

// userSerializer
const userSerializer = (doc) => {
  let obj = {};
  obj._id = doc._id;
  obj.name = doc.name;
  obj.email = doc.email;
  obj.phone = doc.phone;
  obj.active = doc.active;
  obj.avater = doc.avater ? BASE_URL + "uploads/" + doc.avater : "";
  obj.usertype = doc.usertype;
  obj.createdAt = doc.createdAt;
  obj.updatedAt = doc.updatedAt;

  return obj;
};

// delete images
const deleteImages = async (images) => {
  for (let img of images) {
    // deleting wdkkkkkkkk

    const imagePath = `${__dirname}/../public/uploads/${img}`;

    fs.unlink(imagePath, async (error) => {
      if (error) return console.log(error);
    });
  }
};

const servicesFunc = (service) => {
  let servisArray = service.split(",");

  let _services = [];
  let serviceobj;
  for (let service of servisArray) {
    if (service) {
      serviceobj = { id: uuid(), service, date: Date.now() };
    }

    _services = [..._services, serviceobj];
  }
  return _services;
};

// address function
const addressFunction = (data) => {
  const address = {};
  address.region = data.region;
  address.district = data.district;
  address.town = data.town;
  address.subcounty = data.subcounty;
  address.parish = data.parish;
  address.village = data.village;
  address.street = data.street;

  return address;
};

const priceFunction = (data) => {
  let prices = [];
  let __price1 = {};
  let __price2 = {};
  let __price3 = {};
  let __price4 = {};

  if (data.price1 !== "" && data.per1 !== "") {
    __price1.price1 = data.price1;
    __price1.per1 = data.per1;
    prices.push(__price1);
  }

  if (data.price2 && data.per2) {
    __price2.price1 = data.price2;
    __price2.per1 = data.per2;
    prices.push(__price2);
  }

  if (data.price3 && data.per3) {
    __price3.price1 = data.price3;
    __price3.per1 = data.per3;
    prices.push(__price3);
  }

  if (data.price4 && data.per4) {
    __price4.price1 = data.price4;
    __price4.per1 = data.per4;
    prices.push(__price4);
  }

  return prices;
};
// taking payment and appenting to the data
const timeLeft = (amount, rating) => {
  // console.log(rating);
  if (amount) {
    const amt = amount.amount;
  
    let cash = amt - amt * 0.02; //taking two % from the amount
    // getting the amount per second
    const amounPerSce = (30 / rating) * 24 * 60 * 60;
    const seconds = amounPerSce * cash;

    // return amt;

    // getting the number of days it will last
    const min = 60;
    const hr = 60 * 60;
    const day = 60 * 60 * 24;
    const month = 60 * 60 * 24 * 30;
    const yr = 60 * 60 * 24 * 30 * 12;

    if (seconds / yr >= 1) {
      return Math.round(seconds / yr).toString() + " yrs";
    }
    if (seconds / month >= 1) {
      return Math.round(seconds / month).toString() + " mths";
    }
    if (seconds / day >= 1) {
      return Math.round(seconds / day).toString() + " dys";
    }
    if (seconds / hr > 1) {
      return Math.round(seconds / hr).toString() + " hrs";
    }
    if (seconds / min > 1) {
      return Math.round(seconds / min).toString() + " mins";
    } else {
      return "0 sec";
    }
  } else {
    return "0 sec";
  }
};
//
module.exports = {
  houseSerilise,
  userSerializer,
  deleteImages,
  servicesFunc,
  addressFunction,
  priceFunction,
  timeLeft,
};
