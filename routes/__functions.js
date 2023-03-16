const BASE_URL = require('./__config')
const {timeAgo} = require('./validateUser')


const getImagesUrl = (img)=>{
    let newurl = []
    for (let i of img){
        newurl = [...newurl, BASE_URL+'uploads/'+i]
    }
    return newurl
}

// 
// serialise houser
const houseSerilise = (house)=>{

    // if(house){

        const single_house  ={}
        single_house.id = house._id,
        single_house.name = house.name,
        single_house.user_id = house.user_id,
        single_house.approve = house.approve,
        single_house.active = house.approve,
        single_house.images = getImagesUrl(house.images),
        single_house.services = house.services,
        single_house.description = house.description,
        single_house.phone = house.phone,
        single_house.prices = house.prices,
        single_house.createdAt = house.createdAt,
        single_house.updatedAt = timeAgo(house.createdAt)
    // }

    return single_house
}

// delete images 
const deleteImages = async (images)=>{
    for (let img of images){
        // deleting wdkkkkkkkk

        const imagePath = `${__dirname}/../public/uploads/${img}`;

        fs.unlink(imagePath, async (error) => {
            if (error) return console.log(error);
        });
    }
}
// 
module.exports = {houseSerilise, deleteImages}