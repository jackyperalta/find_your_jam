const express = require('express');
const mongoose = require('mongoose');
const passport = require ('passport');
const session = require('express-session');
const flash = require('connect-flash');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();
require('./config/passport.js')(passport);
const {ensureAuthenticated} = require('./config/auth');

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

// J.P: 3/17/21 - Import routers
const userRouter = require ('./routes/UserRouter.js');
const bookRouter = require('./routes/booksAPI.js');
const movieRouter = require('./routes/moviesAPI.js');

app.use('/users', userRouter);
app.use('/book_results', bookRouter);
app.use('/results', movieRouter);

/** Homepage */
app.get('/', (req, res) => {
    res.render('indexk.ejs')
});

/** Movies */
app.get('/movies', (req, res) => {
    res.render('movies_page.ejs')
});

/* ********************************************************************** */
/** Music */
app.get('/music', (req, res) => {
    res.render('music_page.ejs')
});

/**
 * https://www.npmjs.com/package/spotify-web-api-node#client-credential-flow
 */
const client_ID = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: client_ID,
    clientSecret: client_secret
});

spotifyApi.clientCredentialsGrant()
.then(function(data){
    // if token expires, restart the server
    console.log('Spotify access token expires in ' + data.body['expires_in'] + ' seconds.');
    spotifyApi.setAccessToken(data.body['access_token']);
}, function (err) {
    console.log('Error when retrieving access token: ', err);
});

// Get multiple artists
app.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.search)
      .then(function(data) {
        console.log('Artist search: ' + req.query.search);
        res.render('music_artists.ejs', { artists: data.body.artists.items });
      }, function(err) {
        console.log('Something went wrong!', err);
      });
});

// Get multiple albums
app.get('/albums', (req, res, next) => {
    spotifyApi.searchAlbums(req.query.search)
      .then(function(data) {
        console.log('Album search: ' + req.query.search);
        res.render('music_albums.ejs', { albums: data.body.albums.items });
    }, function(err) {
        console.log('Something went wrong!', err);
    });
});

// Get multiple tracks
app.get('/tracks', (req, res, next) => {
    spotifyApi.searchTracks(req.query.search)
    .then(function(data) {
        console.log('Track search: ' + req.query.search);
      res.render('music_tracks.ejs', { tracks: data.body.tracks.items });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
})

/* ********************************************************************** */

/** Books */
app.get('/books', (req, res) => {
    res.render('books_page.ejs')
});

// E.C: 05-01-2021 - Only registered users will view their bookmarked results
/** Bookmarks */
app.get('/bookmarks', ensureAuthenticated, (req, res) => {
    res.render('bookmark.ejs', {
        user: req.user
    })
});

/** Help */
app.get('/help', (req, res) => {
    res.render('help.ejs')
});

/** Listener */
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));