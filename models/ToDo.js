const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const todoSchema = new Schema({
    title : String,
    body  : String,
    tag   : [String],
    userid  : {
        type : Schema.Types.ObjectId, ref : 'User'
    }
})

let ToDo = mongoose.model('ToDo', todoSchema)

module.exports = ToDo