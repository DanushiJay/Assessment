const path = require ('path')
const multer = require ('multer')
const User = require('../models/user')

var storePhoto = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'photoUploads/')
    },
    filename: function(req, file, cb) {
        let ext = path. extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

var profilePicUpload = multer ({
    storage: storePhoto, 
    fileFilter: function(req, file, callback) {
        User.findOne({ email: req.body.email })
        .then(existingUser => {
            if (existingUser) {
                callback(null, false)
            } 
            else{ 
                if(
                    file.mimetype == "image/png" ||
                    file.mimetype ==  "image/jpeg"
                    ){
                        callback(null, true)
                    } 
                    else {
                        console.log('Please upload a jpeg or png file.')
                        callback(null, true)
                    }
                }
            })
    },
    limits: {
        fileSize: 360 * 360 * 2
    }
            
    })

    module.exports = profilePicUpload
