const express = require ('express')
const router = express.Router()

const photoUpload = require('../middleware/photoUpload')
const userAuthController = require ('../controller/userAuthController')

router.post('/registration', photoUpload.single('profilePicture'), userAuthController.userRegistration)
router.post('/login', userAuthController.userLogin)

module.exports = router




