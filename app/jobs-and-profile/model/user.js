const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema  = new Schema({
    fname:String,
    lname:String,
    email:String,
    password:String
})

const User = mongoose.model('event',eventSchema);

module.exports = {Event: User}