const User      = require('../models/User')
const bcrypt    = require('bcrypt')
const jwt       = require('jsonwebtoken')
const saltRound = 10
const FB        = require('fb')


module.exports = {
    signUp : (req,res) => {
        let userPassword = bcrypt.hashSync(req.body.password, saltRound)

        User.create({
            username : req.body.username,
            password : userPassword,
            name     : req.body.name,
            email    : req.body.email,
            gender   : req.body.gender,
            picture  : req.body.picture || null
        },(err,user) => {
            if (err) {
                res.status(500).json({
                    message : `Fail to create new account ! ${err.message}`,
                    data    : {}
                })
            } else {
                let token = jwt.sign({userid : user._id}, process.env.SECRET)
                res.status(200).json({
                    message : `Sign Up success !`,
                    data    : {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        token: token
                    }
                })
            }
        })
    },

    signIn : (req,res) => {
        User.findOne({
            $or : [
                {username : req.body.username_email},
                {email    : req.body.username_email}
            ]
        })
        .exec()
        .then((userData) => {
            if(userData) {
                let passwordCheck = bcrypt.compareSync(req.body.password, userData.password)
                if (passwordCheck) {
                    let token = jwt.sign({userid : userData._id}, process.env.SECRET)
                    res.status(200).json({
                        message : `Sign in success !`,
                        data    : {
                            id : userData._id,
                            name     : userData.name,
                            username : userData.username,
                            email : userData.email,
                            gender : userData.gender,
                            phone_number : userData.phoneNumber,
                            picture : userData.picture,
                            token : token
                        }
                    })
                } else {
                    res.status(202).json({
                        message : `Sign in failed, username/email or password wrong`,
                        data    : null
                    })
                }
            } else {
                res.status(202).json({
                    message : `Sign in failed, username/email or password wrong`,
                    data    : null
                })
            }

        })
        .catch((err) => {
            res.status(500).json({
                message : `Error occured on getting users data ${err}`
            })
        })
    },

    signInFb : (req,res) => {
        FB.api('me', { fields: ['id' , 'name', 'email', 'gender', 'picture'], access_token: req.headers.fb_token }, function (userFbData) {
            if(userFbData) {
                User.create({
                    id_fb : userFbData.id,
                    name  : userFbData.name,
                    username : null,
                    email : userFbData.email,
                    password : null,
                    gender: userFbData.gender,
                    picture : userFbData.picture.data.url
                },(err, newUser) => {
                    if (err) {
                        User.findOne({
                            email : userFbData.email,
                            id_fb : userFbData.id
                        })
                        .exec()
                        .then((user) => {
                            let token   = jwt.sign({id : newUser._id}, process.env.SECRET)
                            res.status(200).json({
                                message : `Login with facebook success !`,
                                data    : ({
                                    id   : user._id,
                                    id_fb : user.id_fb,
                                    name  : user.name,
                                    email : user.email,
                                    gender : user.gender,
                                    picture : user.picture,
                                    token : token
                                })
                            })
                        })
                        .catch((err) => {
                            res.status(500).json({
                                message : `Failed to connect with facebook ! ${err}`,
                                data    : {}
                            })
                        })
                    } else {
                        let token   = jwt.sign({id : newUser._id}, process.env.SECRET)

                        res.status(200).json({
                            message : `Login with facebook success !`,
                            data    : ({
                                id   : newUser._id,
                                id_fb : newUser.id_fb,
                                name  : newUser.name,
                                email : newUser.email,
                                gender : newUser.gender,
                                picture : newUser.picture,
                                token : token
                            })
                        })
                    }
                })
            } else {
                res.status(500).json({
                    message : `Failed to connect with facebook !`,
                    data    : {}
                })
            }
        })
    },

    testJwt : (req,res) => {
        res.status(200).json({
            message : `Congrats, you reach here !`
        })
    }
}