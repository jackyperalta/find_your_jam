// JP: 2021-05-01 -  implemented bookmark model
// Maintained by: Jacqueline Peralta

const mongoose = require('mongoose');
const user = require('../models/UserModel.js');

const bookmarkSchema = new mongoose.Schema({
    title: String,
    url: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: user} // one-to-many relationship
});

module.exports = mongoose.model('bookmarks', bookmarkSchema);