// E.C: 03-08-2021 - Implement routes
// E.C: 03-20-2021 - Updated all routes
// E.C: 04-27-2021 - Fixed logout route and updated the middleware for
// login/register 
// E.C: 05-01-2021 - Attempted to fix flash messages
// E.C: 05-14-2021 - THANK YOU TOOTHMAN! Went into office hours and now flash messages work.
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel.js');
const bcrypt = require ('bcrypt');
const passport = require ('passport');
const {forwardAuthenticated} = require('../config/auth');

// Login
router.get('/login', forwardAuthenticated, (req,res)=>{
    res.render('login');
});
// Flash messages for login are still not visible 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/bookmarks',
      failureRedirect: '/users/failed',
    })(req, res, next);
});
router.get('/failed', (req, res) => {
    req.flash('message', 'Invalid email or password.');
    res.send(JSON.stringify({url: 'login'}));
});

// Register 
router.get('/register', forwardAuthenticated, (req,res)=>{
    res.render('register');
});
router.post('/register',(req,res)=> {
    const {name,email, password} = req.body;
    console.log(' Name: ' + name+ ' Email: ' + email+ ' Password: ' + password);
    User.findOne({email : email}).then(user=>{
        console.log(user);   
        if(user) {
            console.log('Email has already been registered!');
            req.flash('message', 'Email has already been registered!');
            res.send(JSON.stringify({url: 'register'}));
        } else {
            const newUser = new User({
                name : name,
                email : email,
                password : password
            });
            // Hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt, (err,hash)=> {
                if(err) throw err;
                // Save pass to hash
                newUser.password = hash;
                // Save user
                newUser.save()
                .then((value)=>{
                    console.log(value);
                    console.log('Your account has been created! You can now login.');
                    req.flash('message', 'Your account has been created! You can now login.');
                    //res.render('login');
                    //res.body.url = "login";
                    //res.body.message = 'Your account has been created! You can now login.'
                    //res.render('login');
                    res.send(JSON.stringify({url: "login", message: "Your account has been created! You can now login."}));
                    // Goal was to redirect users to login and then display flash message
                    //res.redirect('/users/login');
                })
                .catch(err=> console.log(err));
            }))
        }
    })
});

// Logout 
router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        req.flash('message', 'You have been logged out!');
        console.log('You have been logged out!')
        return res.redirect('/users/login');
    }
    req.flash('message', 'You cannot logout but you can sign in!');
    console.log('You cannot log out but you can sign in!')
    return res.redirect('/users/login');
   });
module.exports = router;