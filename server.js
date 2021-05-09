const express = require('express');
const mongoose = require('mongoose');
const passport = require ('passport');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
require('./config/passport.js')(passport);
const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({extended: false}))
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

// E.C: 04-01-2021 - Express-session 
app.use(session({
    secret : process.env.SESSION_SECRET,
    saveUninitialized : true,
    resave : true
}));
// For user authentication - passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());
app.use((req,res,next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// J.P: 2021-03-17 - Adding routes
const userRouter = require ('./routes/UserRouter.js');
const bookRouter = require('./routes/booksAPI.js');
const movieRouter = require('./routes/moviesAPI.js');
const musicRouter = require('./routes/spotifyAPI.js')
const bookmarkRouter = require('./routes/bookmarkRouter.js')

app.use('/users', userRouter);
app.use('/book_results', bookRouter);
app.use('/results', movieRouter);
app.use('/', musicRouter);
app.use('/', bookmarkRouter);

/** Homepage */
app.get('/', (req, res) => {
    res.render('indexk.ejs')
});

/** Movies */
app.get('/movies', (req, res) => {
    res.render('movies_page.ejs')
});

/** Books */
app.get('/books', (req, res) => {
    res.render('books_page.ejs')
});

/** Music */
app.get('/music', (req, res) => {
    res.render('music_page.ejs')
});

/** Help */
app.get('/help', (req, res) => {
    res.render('help.ejs')
});

/** Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));