// JP: 2021-05-01 -  implemented bookmark model responsible for creating and reading documents from  DB
// Maintained by: Jacqueline Peralta

const mongoose = require('mongoose');

const bkSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required!'],
        unique: true,
        lowercase: true,
        trim: true
    },
    bookmarks: {
        type: [{type: String}],
        required: true
    }
});

module.exports = mongoose.model('bookmarks', bkSchema);