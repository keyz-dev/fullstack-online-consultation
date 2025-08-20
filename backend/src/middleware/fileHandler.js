const multer = require('multer')
const path = require('path')
const {v4 : uuid} = require('uuid')
const fs = require('fs')
const logger = require('../utils/logger')
require('dotenv').config()
const documentFilter = require('./fileFilter')

const fileSize =  1024*1024*5
const folderPath = path.join(__dirname, '..', 'public', 'uploads')
const inProduction = process.env.NODE_ENV === 'production'


// Filter the image types
function imageFilter(req, file, cb){
    if(file.mimetype.startsWith('image')){
        cb(null, true)  
    }else{
        msg = JSON.stringify({msg:"invalid file extension", picField: file.fieldname })
        cb(new Error(msg), false)
    }
}

// Generalized file storage implementation
const genericStorage = (subfolder) =>{
    let subfolderPath = path.join(folderPath, subfolder)
    // Create the folder if it doesn't exist
    if(!fs.existsSync(subfolderPath)) fs.mkdirSync(subfolderPath)

    // Return the storage configuration
    return multer.diskStorage({
        destination: function(req, file, cb){
            let fileLocation = subfolderPath
            if (subfolder === 'patients' || subfolder === 'doctors'){
                fileLocation = path.join(subfolderPath, file.fieldname)
                if (!fs.existsSync(fileLocation)) fs.mkdirSync(fileLocation)
            }
            return cb(null, fileLocation)
        },
        filename: function(req, file, cb){
            var new_name = uuid() + path.extname(file.originalname) 
            return cb(null, new_name)
        }
    });
}

// upload the symptom to disk if in development, and to the cloud in in production
const symptomUpload = multer({
    storage: inProduction ?  multer.diskStorage({}): genericStorage("symptoms"), 
    limits: { fileSize: fileSize },
    fileFilter: imageFilter
})

const createProfileUploader = (folderName) => 
    multer({
        storage: inProduction ? multer.diskStorage({}) : genericStorage(folderName),
        limits: { fileSize: fileSize },
        fileFilter: (req, file, cb) => {
            if (file.fieldname === 'profileImage') {
                return imageFilter(req, file, cb);
            }
            if (file.fieldname === 'document') {
                return documentFilter(req, file, cb);
            }
        }
    }).fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'document', maxCount: 1 }
    ]);

// Patient and Doctor profile uploaders
const patientProfileUpload = createProfileUploader("patients");
const doctorProfileUpload = createProfileUploader("doctors");

const svgUpload = (svgContent, specialtyName)=>{
    if(!fs.existsSync(path.join(folderPath, 'svgs'))){
        fs.mkdirSync(path.join(folderPath, 'svgs'))
    }
    const fileName = specialtyName.toLowerCase() + uuid() + '.svg'
    const svgPath = path.join(folderPath, 'svgs', fileName)
    fs.writeFileSync(svgPath, svgContent)

    logger.info(`Uploaded SVG file: ${fileName}`)
    return {fileName, svgPath}
}

const uploadNone = multer().none()

// Export the functions
module.exports = {
    uploadNone,
    svgUpload,
    patientProfileUpload,
    doctorProfileUpload,
    symptomUpload,
}