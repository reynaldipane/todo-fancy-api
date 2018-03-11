const ToDo = require('../models/ToDo')

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

    create : (req,res) => {        
        ToDo.create({
            title : req.body.title,
            body  : req.body.body,
            tag   : req.body.tag,
            userid  : req.body.id_user
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
    }
}