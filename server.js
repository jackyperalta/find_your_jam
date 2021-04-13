const express = require('express');
const mongoose = require('mongoose');
const passport = require ('passport');
const session = require('express-session');
const axios = require('axios');
require('dotenv').config();
require('./config/passport.js')(passport);

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// DB Config
mongoose.connect(process.env.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('database connected...'))
.catch(err => console.log(err));

// EC: 04-01-2021 - Express-session 
app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : true,
    saveUninitialized : true
   }));
// For user authentication - passport middleware
app.use(passport.initialize());
app.use(passport.session());

// J.P: 3/17/21 - Import routers
const userRouter = require ('./routes/UserRouter.js');
app.use('/users', userRouter);


/** Homepage */
app.get('/', (req, res) => {
    res.render('indexk.ejs')
});

/** Account */
app.get('/account', (req, res) => {
    res.render('Account.ejs')
});

/** Movies */
app.get('/movies', (req, res) => {
    res.render('movies_page.ejs')
});

app.get('/results', async(req, res) => {
    let search = req.query.search;
    try {
        const url = `http://www.omdbapi.com/?s=${search}&apikey=${process.env.OMDb_API_KEY}`;
        const movieAPI = await axios.get(url);
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

/** Music */
app.get('/music', (req, res) => {
    res.render('music_page.ejs')
});

/** Books */
app.get('/books', (req, res) => {
    res.render('books_page.ejs')
});

/** Bookmarks */
app.get('/bookmarks', (req, res) => {
    res.render('bookmark.ejs')
});

/** Help */
app.get('/help', (req, res) => {
    res.render('help.ejs')
});

/** Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
