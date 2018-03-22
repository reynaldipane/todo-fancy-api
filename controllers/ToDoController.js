const ToDo          = require('../models/ToDo')
const axios         = require('axios')
const Translate     = require('@google-cloud/translate');
const nodemailer    = require('nodemailer')
const xoauth2       = require('xoauth2')

module.exports = {
    findAll   : (req,res) => {
        ToDo.find()
        .populate('userid')
        .exec()
        .then((todos) => {
            res.status(200).json({
                message : `Get all todos success !`,
                data    : todos
            })
        })
        .catch(err => {
            res.status(400).json({
                message : `Error getting all todos ! ${err}`
            })
        })
    },

    findByUserId : (req,res) => {
        ToDo.find({userid : req.body.userId})
        .exec()
        .then((todos) => {
            if (todos) {
                res.status(200).json({
                    message : `Get all user todos success !`,
                    data    : todos
                })
            } else {
                res.status(202).json({
                    message : `No to do found !`,
                    data    : {}
                })
            }
        })
        .catch((err) => {
            res.status(202).json({
                message : `No to do found ! ${err}`,
                data    : {}
            })
        })
    },

    findById : (req,res) => {
        ToDo.findById(req.params.id)
        .exec()
        .then((todo) => {
            res.status(200).json({
                message : `Get todo by id success !`,
                data    : todo
            })
        })
        .catch(err => {
            res.status(400).json({
                message : `Error getting all todos ! ${err}`
            })
        })
    },

    create : (req,res) => {        
        ToDo.create({
            title : req.body.title,
            body  : req.body.body,
            tag   : req.body.tag,
            userid  : req.body.id_user,
            status : 'Not Yet Done'
        },(err,todo) => {
            if (err) {
                res.status(500).json({
                    message : `Failed to add new todo! ${err}`,
                    data    : {}
                })
            } else {
                res.status(200).json({
                    message : `New todo added !`,
                    data    : todo
                })

                let transporter = nodemailer.createTransport({
                    service : `gmail`,
                    auth: {
                        type : `OAuth2`,
                        user : `reynaldipane@gmail.com`,
                        clientId : `386513767915-265qckm7lh4trf19m2vu1g8h4aar35p8.apps.googleusercontent.com`,
                        clientSecret : `1FrBiFdT97_3OmPIx32G9uJB`,
                        refreshToken : `1/Ju212Ol80rwPFl-f6EX4Ct5GVSIlfLopvg3z12TaUFDt-hB0_gNytECejo_MaH5M`
                    }
                })

                let mailOptions = {
                    from: 'Purge To Do <reynaldipane@gmail.com>',
                    to: req.body.email,
                    subject: 'Hello',
                    text: `Hello user, you created a note at Purge To Do Fancy.
                        Dont forget to do :
                        ${todo.title},
                        ${todo.body},
                        Cheers !
                    `,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    } else {
                        console.log(`Email sent !`);
                        
                    }
                });
            }
        })
    },

    update : (req,res) => {        
        ToDo.findByIdAndUpdate(req.params.id, {
            title : req.body.title,
            body  : req.body.body,
            tag   : req.body.tag,
            userid  : req.body.id_user
        }, {new : true}, (err,updatedTodo) => {   
            console.log(err)       
            if (err) {             
                res.status(500).json({
                    message : `Failed to update to do ${err}`,
                    data    : {}
                })
            } else {
                res.status(200).json({
                    message : `Update to do success !`,
                    data    : updatedTodo
                })
            }
        })
    },

    updateStatusTask : (req,res) => {        
        ToDo.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        }, {new : true}, (err,updatedTodo) => {   
            console.log(err)       
            if (err) {             
                res.status(500).json({
                    message : `Failed to update to do ${err}`,
                    data    : {}
                })
            } else {
                res.status(200).json({
                    message : `Update to do success !`,
                    data    : updatedTodo
                })
            }
        })
    },

    delete : (req,res) => {
        ToDo.findByIdAndRemove(req.params.id,(err,deletedToDo) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                    message : `Error deleting to do ! ${err}`,
                    data : {}
                })
            } else {
                res.status(200).json({
                    message : `Delete todo success !`,
                    data    : deletedToDo
                })
            }
        })
    },

    userSearch : (req,res) => {
        ToDo.find({
            $or : [
                {tag : {$regex : `.*${req.body.keyword}.*`, $options : `i`}},
                {title : {$regex : `.*${req.body.keyword}.*`, $options : `i`}}
            ],
            userid : req.params.userid
        })
        .exec()
        .then((todos)=>{
            if (todos.length) { 
                res.status(200).json({
                    message : `Search success !`,
                    data    : todos
                })
            } else {
                res.status(404).json({
                    message : `Search returning empty result !`,
                    data    : []
                })
            }
        })
        .catch(err=>{
            res.status(500).json({
                message : `Something went wrong when trying to search todos ! ${err}`,
                data    : []
            })
        })
    },

    translate : (req,res) => {
        let dataToDo = req.body.text;
        console.log(dataToDo);
        
        let projectId = `ecommerce-198006`
        let keyFileName = `ecommerce-c6d7f797aaaa.json`

        let translate = new Translate({
            keyFilename: keyFileName,
        });

        let target = `en`
        translate.translate(dataToDo, target)
        .then(results => {
            res.status(200).json({
                message   : `Success translating the data !`,
                translate : results[0]
            })
        })
        .catch(err => {
            res.status(500).json({
                message : `Something went wrong when trying to translate todos ! ${err}`,
                data    : [] 
            })
        })
    }
}