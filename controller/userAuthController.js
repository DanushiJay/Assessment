const  User = require('../models/user')
const bcrypt = require ('bcryptjs')
const jwt = require('jsonwebtoken')

const userRegistration = (req,res,next) => {
    User.findOne({ email: req.body.email })
    .then(existingUser => {
        if (existingUser) {
            res.json({
                message: 'This email address already exists. Please try registering with a different email address.!'
            })
        } 
        else{   
            if (req.body.password !== req.body.confirmPassword) {
                res.json({
                    message: 'Password confirmation failed. Please re-enter your password and confirm password.'
                })
            }
            else{
                bcrypt.hash(req.body.password, 15, function(err, hashedPass){
                    if(err){
                        res.json({
                            error:err
                        })
                    }
                    let user = new User ({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        phoneNumber: req.body.phoneNumber,
                        email: req.body.email,
                        password: hashedPass
                    })
                    if(req.file){
                        user.profilePicture = req.file.path
                    }
                    user.save()
                    .then(user => {
                        res.json({
                            message: 'Your account has been successfully created!'
                        })
                    })
                    .catch(error =>{
                        res.json({
                            message: 'Unfortunately, your registration was unsuccessful. Please check your details and try again later.!'
                        })
                    })
                })
            }
        }
    })
}

const userLogin =(req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    User.findOne({$or: [{email:username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err){
                    res.json({
                        error:err
                    })
                }
                if(result){
                    let token = jwt.sign({name: user.firstName}, 'AzQ,PI)0(', {expiresIn: '1h'})
                    
                    const userDetails = [
                        `First Name: ${user.firstName}`,
                        `Last Name: ${user.lastName}`,
                        `Phone Number: ${user.phoneNumber}`,
                        `Email: ${user.email}`,
                        `Profile Picture Path: ${user.profilePicture}`
                    ];
                    
                    const message = `You have successfully logged in to your account!\n${userDetails.join('\n')}\nToken: ${token}`;
                    
                    res.set('Content-Type', 'text/plain');
                    res.send(message);
                }else{
                    res.json({
                        message: 'The password you entered is incorrect. Please try again!'
                    })
                }
            })
        } else{
            res.json({
                message: 'The username or email address you entered does not exist in our system !'
            })
        }
    })
}

module.exports = {
    userRegistration,
    userLogin
}