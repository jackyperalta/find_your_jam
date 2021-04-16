const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * https://developers.google.com/books/docs/v1/reference/volumes/list
 */
router.get("/", async(req, res) => {
    let search_terms = req.query.search;
    let filter = req.query.filter;
    try {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${search_terms}&filter=${filter}`;
        const bookAPI = await axios.get(url);
        console.log('Book search: ' + search_terms + ' (' + filter + ')');
        res.render('books_results.ejs', { books : bookAPI.data });
    } catch (err) {
        if(err.response) {
            console.log(err.response.data)
        } else if(err.request) {
            console.log(err.request)
        } else {
            console.error('Error', err.message)
        }
    } 
})

module.exports = router;