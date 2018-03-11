const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const userSchema = new Schema({
    id_fb    : String,
    name     : String,
    username : String,
    password : String,
    email    : String,
    phoneNumber : String,
    gender    : String,
    picture  : String
})

const User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
    var self = this
    if (self.username) {
        User.find({
            $or : [
                {email : self.email},
                {username : self.username}
            ]
        })
        .exec()
        .then((user) => {
            if (user.length) {
                next(new Error(`Username or Email already taken !`))
            } else {
                next()
            }
        })
    } else {
        User.find({
            email : self.email
        })
        .exec()
        .then((user) => {
            if (user.length) {
                next(new Error(`Username or Email already taken !`))
            } else {
                next()
            }
        })
    }

})

module.exports = User;