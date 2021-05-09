// spotifyAPI.js - Get requests to Spotify API using Client Credential Flow
// Maintained by: Jacqueline Peralta

const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const client_ID = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: client_ID,
    clientSecret: client_secret
});

spotifyApi.clientCredentialsGrant()
.then(function(data){
    // if token expires, restart the web server
    console.log('Spotify access token expires in ' + data.body['expires_in'] + ' seconds.');
    spotifyApi.setAccessToken(data.body['access_token']);
}, function (err) {
    console.log('Error when retrieving access token: ', err);
});

// Get multiple artists
router.get('/artists', (req, res, next) => {
    spotifyApi.searchArtists(req.query.search)
    .then(function(data) {
        console.log('Artist search: ' + req.query.search);
        res.render('music_artists.ejs', { artists: data.body.artists.items });
    }, function(err) {
        console.log('Something went wrong!', err);
    });
});

// Get multiple albums
router.get('/albums', (req, res, next) => {
    spotifyApi.searchAlbums(req.query.search)
      .then(function(data) {
        console.log('Album search: ' + req.query.search);
        res.render('music_albums.ejs', { albums: data.body.albums.items });
    }, function(err) {
        console.log('Something went wrong!', err);
    });
});

// Get multiple tracks
router.get('/tracks', (req, res, next) => {
    spotifyApi.searchTracks(req.query.search)
    .then(function(data) {
        console.log('Track search: ' + req.query.search);
      res.render('music_tracks.ejs', { tracks: data.body.tracks.items });
    }, function(err) {
      console.log('Something went wrong!', err);
    });
});

module.exports = router;