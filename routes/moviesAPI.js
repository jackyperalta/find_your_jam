// moviesAPI.js - GET request to The Open Movie Database API
// Maintained by: Jacqueline Peralta

const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async(req, res) => {
    let search = req.query.search;
    let filter = req.query.filter;
    try {
        const url = `http://www.omdbapi.com/?s=${search}&type=${filter}&apikey=${process.env.OMDb_API_KEY}`;
        const movieAPI = await axios.get(url);
        console.log('Movie search: ' + search + '(' + filter + ')');
        res.render('movie_results.ejs', { movies : movieAPI.data.Search });
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