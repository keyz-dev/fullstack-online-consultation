const cloudinary = require('cloudinary').v2
const logger = require('./logger')
require('dotenv').config()

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudinaryUpload = async (filepath, folder)=>{
    const result = await cloudinary.uploader
        .upload(filepath, {folder: "online_consultation/" + folder})
        .catch(err => {
            logger.error(`Error uploading to cloudinary: ${err}`)
            throw new Error(err)
        })
    return result.secure_url
}

const cloudinaryDelete = async (filepath)=>{
    await cloudinary.uploader
       .destroy(filepath)
       .catch(err => {
            logger.error(`Error deleting from cloudinary: ${err}`)
            throw new Error(err)
        })
}

module.exports = { cloudinaryUpload, cloudinaryDelete }