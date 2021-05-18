# Find Your Jam
Find Your Jam is a website that lets you search for movies, music, and books. You 
have the option to create an account to bookmark any of your search results, as well
as a dropdown menu to filter them. Enjoy!

## What will you need?
Download and install [Node.js](https://nodejs.org/en/download/).

*To check if you installed Node.js correctly, go to your terminal and type 'node -v'.*
*You should see the version number of Node.js you just installed.*

## Steps to run our website
There are two ways to run our website on your local machine.

### Compiled version
If you choose to download the compiled version, do the following:
1. Unzip the file.
2. Go to the same directory as server.js and type 'npm start' in your terminal.
3. Open http://localhost:8001 in your favorite web browser.

### Clone repository
If you choose to clone our repository, do the following:
1. Create your own .env file. This file must be in the same directory as server.js.
Host your MongoDB database locally or using [MongoDB Atlas](https://www.mongodb.com/). Obtain your OMDb API key by
registering [here](https://www.omdbapi.com/). Lastly, go to the Spotify for Developer page and obtain your Spotify keys by signing in
with your Spotify credentials. For SESSION_SECRET, you can put a random string of your choice.

*Your .env file should bet set up like this:*
```
DB_URI=
OMDb_API_KEY=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SESSION_SECRET=
```
2. In that same directory, type the following commands in your terminal:
```
npm install
npm start
```
3. Open http://localhost:8001 in your favorite web browser.