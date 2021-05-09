// JP: 2021-05-01 -  implemented bookmark API endpoints 
// Maintained by: Jacqueline Peralta
const express = require('express');
const Bookmark = require('../models/bookmarkModel.js');
const {ensureAuthenticated} = require('../config/auth');
const router = express.Router();

// CREATE
router.post('/allBookmarks', (req, res) => {
    const title = req.body.title;
    const url = req.body.url;
    console.log(title, url);
    const newBookmark = new Bookmark();

    Bookmark.findOne({'title': title}, (err, Bookmark) => {
        if (Bookmark) {
            //res.redirect("/");
            res.send('This Bookmark is already in saved.');
        } else {
            newBookmark.title = title;
            newBookmark.url = url;
            newBookmark.user = req.user._id // when a new bookmark is added it includes the currently logged in user
            console.log(newBookmark);
            newBookmark.save((err) => {
                if(err) throw err;
                res.send("New bookmark, " + newBookmark.title + ", was added to database.");
            });
        };
    });
});

// E.C: 05-01-2021 - Only registered users will view their bookmarked results
/** Bookmarks */
router.get('/bookmarks', ensureAuthenticated, (req, res) => {
    // JP: 2021-05-08 - added snippet to get bookmark for users
    Bookmark.find({user: req.user}, function(err, foundBookmarks){
        if(err){
            console.log(err);
        } else {
            res.render("bookmark.ejs", {bookmarkList:foundBookmarks,  user: req.user});
        }
    });
});

//DELETE: not yet able to check if this works
router.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    Bookmark.findByIdAndDelete(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

module.exports = router;