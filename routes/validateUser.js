const { sign, verify } = require("jsonwebtoken");
const uuid = require('uuid').v4
const path = require("path");
const BASE_URL = require('./__config')

// validatinon of user befour registering
const validateUser = (user) => {
  const error = [];

  if (user.email.length < 6) {
    error.push("email must be more than six charactors long");
  }

  if (user.email.indexOf("@")<0) {
    error.push("email must be valid");
  }

  if (user.name.length < 4) {
    error.push("name must be more than three characters long");
  }
 
  if (user.phone.length < 10) {
    error.push("phone must be more than 9 characters long");
  }
 
  if (user.password.length < 4) {
    error.push("password must more than thr charactors long");
  }
 

  if(error.length>0) return error;
  return []
  
};

// ...............................................................................................................................................................................................

// validatinon of user befour registering
const validateUserUpdate = (user) => {
  const error = [];

  if (user.email.length < 6) {
    error.push("email must be more than six charactors long");
  }

  if (user.email.indexOf("@") < 0) {
    error.push("email must be valid");
  }

  if (user.name.length < 4) {
    error.push("name must be more than three characters long");
  }

  if (user.phone.length < 10) {
    error.push("phone must be more than 9 characters long");
  }

  if (user.usertype !=='admin' || user.usertype !=='super admin') {
    error.push(`${user.usertype} is an invalid usertype`);
  }

  if(error.length>0) return error;
  
};
// ...............................................................................................................................................................................................


// validate the access token
const validateToken = async (req, res, next) => {
  try {
    // get the token from header and if it does not exist
    const token = req.header("tokken");
    if (!token) return res.status(400).send({ error: "incorrect credential" });

    const valid = await verify(token, process.env.JWT_SECREATE);
    if (!valid) return res.status(400).send({ error: "incorrect credential" });
    req.user = valid;
    return next();
  } catch (error) {
    res.status(400).json({ error });
  }
};
// ...............................................................................................................................................................................................

// function for uploading files
const upload_files = async (file) => {

  let extension = await file.name.split('.')
  let mimetype = await file.mimetype.split('/')[0].toUpperCase()
  const exe = await extension[extension.length-1]
  let file_name = await mimetype+'-'+uuid()+"."+exe

  const path = `${__dirname}/../public/uploads/${file_name}`;

  // moving the file to upload folde 
  await file.mv(path, err=>{
    console.log(err);
  })
  return file_name ;
  
};


// console.log('dkkf.sjfj'.toUpperCase)


// time ago fuctionality
const timeAgo = (date)=>{
  const dateInMillisecind = Date.now() - new Date( date);

  // time ago n seconds
  if( dateInMillisecind/ (1000)<60){
      const  sec =Math.floor( dateInMillisecind/ (1000))
    return  `${sec<2? '1 sec ':sec.toString() + ' secs'} ago`;
  }

  // time ago n min
  if( dateInMillisecind/ (1000*60)<60){
      const  min =Math.floor( dateInMillisecind/ (1000*60))
     return `${min<2? '1 min ':min.toString() + ' mins'} ago`;
  }

  // time ago n hr
  if( dateInMillisecind/ (1000*60*60)<24){
      const  hr =Math.floor( dateInMillisecind/ (1000*60*60))
      return`${hr<2? '1 hr ':hr.toString() + ' hrs'} ago`;
  }

  // time ago n days
  if( dateInMillisecind/ (1000*60*60*24)<30){
      const  day =Math.floor( dateInMillisecind/ (1000*60*60*24))
     return `${day<2? '1 day ':day.toString() + ' days'} ago`;
  }

  // time ago n months
  if( dateInMillisecind/ (1000*60*60*24*30)<12){
      const  month =Math.floor( dateInMillisecind/ (1000*60*60*24*30))
     return `${month<2? '1 month':month.toString() + ' month'} ago`;
  }

  // time ago n year
  if( dateInMillisecind/ (1000*60*60*24*30)>=12){
      const  year =Math.floor( dateInMillisecind/ (1000*60*60*24*30))
      return `${year<2? '1 year':year.toString() + ' yrs'} ago`;
  }
  
}

 

module.exports = { validateUser, validateUserUpdate, validateToken, upload_files, timeAgo };
