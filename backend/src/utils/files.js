require('dotenv').config()
const fs = require('fs')
const fsPromises = require('fs').promises
const { cloudinaryDelete } = require('./cloudinary')
const logger = require('./logger')


const inProduction = process.env.NODE_ENV === 'production'

const deleteFileChecker = async (filePath) =>{
    // Verify the environment, whether in production or in development
    if(inProduction){
        // Delete the file from cloudinary
        return await cloudinaryDelete(filePath)
    }
    // Delete the file from disk
    return await deleteFiles(filePath)
}

// delete local files
const deleteFiles = async (files) =>{
    try{
        if(! Array.isArray(files)){
            if(fs.existsSync(files)){
                await fsPromises.unlink(files)
                logger.info(`Deleted file: ${files}`)
            }
            return 
        }
        for (let file in files){
            console.log(`Deleted file: ${file}`)
            if(fs.existsSync(file)){
                await fsPromises.unlink(file)
                logger.info(`Deleted file: ${file}`)
            }
        }
    }catch(err) {throw new Error(err)}
}


module.exports = { deleteFileChecker, deleteFiles }
