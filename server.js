// THIS FILE STARTS THE WEB SERVER
const express = require('express');
const mongoose = require('mongoose');
const passport = require ('passport');
const session = require('express-session');
require('dotenv').config();
require('./config/passport.js')(passport);

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());

app.use(express.static('front-end'));

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

app.get('/', (req, res) => {
    res.sendFile('front-end/indexk.html', { root: __dirname })
});

// Listener
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
