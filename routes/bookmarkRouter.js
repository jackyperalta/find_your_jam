// JP: 2021-05-01 -  implemented bookmark API endpoints 
// Maintained by: Jacqueline Peralta
const express = require('express');
const Bookmark = require('../models/bookmarkModel.js');
const {ensureAuthenticated} = require('../config/auth');
const methodOverride = require('method-override');
//const popup = require('popups');
const router = express.Router();

router.use(methodOverride('_method'));

// CREATE
router.post('/allBookmarks', ensureAuthenticated, (req, res) => {
    const title = req.body.title;
    const url = req.body.url;
    console.log(title, url);
    const newBookmark = new Bookmark();

    Bookmark.findOne({'title': title}, (err, Bookmark) => {
        if (Bookmark) {
            //res.send('This bookmark has already been saved.');
            res.redirect('back');
            console.log('Bookmark saved already.');
        } else {
            newBookmark.title = title;
            newBookmark.url = url;
            newBookmark.user = req.user._id // when a new bookmark is added it includes the currently logged in user
            console.log(newBookmark);
            newBookmark.save((err) => {
                if(err) throw err;
                //res.send("New bookmark, " + newBookmark.title + ", was saved!");
                console.log('Bookmark added.');
                res.redirect('back');
                //res.json({success: true});
            });
        };
    });
});

// E.C: 05-01-2021 - Only registered users will view their bookmarked results
/** Bookmarks */
router.get('/bookmarks', ensureAuthenticated, (req, res) => {
    // JP: 2021-05-08 - added snippet to get bookmark for users
    Bookmark.find({user: req.user}, (err, foundBookmarks) => {
        if(err){
            console.log(err);
        } else {
            res.render("bookmark.ejs", {bookmarkList:foundBookmarks,  user: req.user});
        }
    });
});

router.delete("/bookmarks/:id", (req, res) => {
    Bookmark.findByIdAndDelete(req.params.id, (err) => {
        if(err){
            res.redirect("/bookmarks");
        } else {
            res.redirect("/bookmarks");
        }
    });
});

module.exports = router;