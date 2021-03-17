const mongoose = require('mongoose');

// EC: 03-08-2021 - create the user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String, 
        required: [true, 'Password is required!'],
        lowercase: true,
    }
});

module.exports = mongoose.model('User', userSchema);