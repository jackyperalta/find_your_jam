const mongoose = require('mongoose');

// E.C: 03-08-2021 - Create the user schema
// E.C: 04-08-2021 - Users can register with name instead (updated schema)
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required!'],
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
        minlength: 5
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;