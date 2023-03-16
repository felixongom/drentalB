const express = require('express')
const router = express.Router()
const {upload_files, validateToken } = require('./validateUser')

// all images
router.get('/images', async(req, res)=>{
    const images = await Image.find()
    try {
        res.send(images)
    } catch (error) {
        console.log(error);
    }
})

// upload images

router.post('/upload', async (req, res)=>{
    if(req.files===undefined){
        return  res.status(400).send({mesege:' file requird'})
    }else{
        const file = req.files.file
        const file_return = await upload_files(file)
        res.send({fileName:file_return})
    }
})
// upload multiple images

router.post('/upload-multiple', async(req, res)=>{

    const file_array = req.files.file
    const fileName = [] // collecting the file name in this array and we return

    for( let file of file_array){
        const _fileName = await upload_files(file)
        fileName.push({fileName:_fileName})
    }
    res.send(fileName)
  
})




module.exports = router