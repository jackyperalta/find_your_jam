// E.C: 03-08-2021 - Implement routes
// E.C: 03-20-2021 - Updated all routes
// E.C: 04-27-2021 - Fixed logout route and updated the middleware for
// login/register 
// E.C: 05-01-2021 - Attempted to fix flash messages
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
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
});

// Register 
router.get('/register', forwardAuthenticated, (req,res)=>{
    res.render('register');
});
// Flash messages are not displaying on the right page
router.post('/register',(req,res)=> {
    const {name,email, password} = req.body;
    console.log(' Name: ' + name+ ' Email: ' + email+ ' Password: ' + password);
    User.findOne({email : email}).then(user=>{
        console.log(user);   
        if(user) {
            console.log('Email has already been registered!');
            req.flash('error_msg', 'Email has already been registered!');
            res.render('register');
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
                    req.flash('success_msg', 'Your account has been created! You can now login.');
                    // res.render does not work but should print the flash message on the register page
                    res.redirect('/users/login')
                    //return res.render('login');
                })
                .catch(value=> console.log(value));
            }))
        }
    })
});

// Logout 
router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        req.flash('success_msg', 'You have been logged out!');
        console.log('You have been logged out!')
        return res.redirect('/users/login');
    }
    req.flash('success_msg', 'You cannot logout but you can sign in!');
    console.log('You cannot log out but you can sign in!')
    return res.redirect('/users/login');
   });
module.exports = router;