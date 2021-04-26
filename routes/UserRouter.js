// EC: 03-08-2021 - Implement routes
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel.js');
const bcrypt = require ('bcrypt');
const passport = require ('passport');

// Login
router.get('/login',(req,res)=>{
    req.logout();
    //res.send(req.flash('message'));
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/bookmarks', 
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
});

// Register 
router.get('/register',(req,res)=>{
    res.render('register.ejs');
    //res.send(req.flash('success_msg'));
    //res.send(req.flash('error_msg'));
});
router.post('/register',(req,res)=> {
    const {name,email, password} = req.body;
    console.log(' Name: ' + name+ ' Email: ' + email+ ' Password: ' + password);
    User.findOne({email : email}).then(user=>{
        console.log(user);   
        if(user) {
            console.log('Email has already been registered!');
            req.flash('error_msg', 'Email has already been registered!');
            res.render('register', {name, email, password});
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
                    req.flash('success_msg', 'Your account has been created! You can now login.');
                    console.log('Your account has been created! You can now login.');
                    res.redirect('/users/login');
                })
                .catch(value=> console.log(value));
            }))
        }
    })
});

// Logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login');
    //res.send(req.flash('success_msg'));
});
module.exports = router;