// EC: 03-08-2021 - Implement routes
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel.js');
const bcrypt = require ('bcrypt');
const passport = require ('passport');

// Register 
router.post('/register',(req,res)=> {
    const {username,email, password} = req.body;
    let errors = [];
    console.log(' Username :' + username+ ' Email :' + email+ ' Password:' + password);
    if(!username || !email || !password) {
        console.log('Please fill in all fields');
        //errors.push('Please fill in all fields');
    }
    if(password.length < 6 ) {
        console.log('Password needs to be at least 6 characters');
        //errors.push('Password needs to be at least 6 characters');
    }
    if(errors.length > 0 ) {
        res.render('/users', {
            errors : errors,
            username : username,
            email : email,
            password : password})
        } else {
            // Validation passed
            User.findOne({email : email}).exec((err,user)=>{
                console.log(user);   
                if(user) {
                    console.log('Email has already been registered!');
                    //errors.push('Email has already been registered!');
                    //res.render('/users',{errors})
                }
            User.findOne({username : username}).exec((err,user)=>{
                console.log(user);   
                if(user) {
                    console.log('Username has already been taken!');
                    //errors.push('Username has already been taken!'); 
                    //res.render('/users',{errors})
                } else {
                    const newUser = new User({
                        username : username,
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
                            res.redirect('/users');
                        })
                        .catch(value=> console.log(value));
                    }));
                }
            })
        })
    }})
// Login
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      // Should redirect if login fails
      if (!user) { return res.redirect('/users/failed'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        // Should redirect if login succeeds
        return res.redirect('/users/success');
      });
    })(req, res, next);
});

// Testing routes for login
router.get('/success',(req,res)=>{
    res.send('You have logged in!');
})
router.get('/failed',(req,res)=>{
    res.send('Could not login!');
})

// Logout
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/users/login');
})
module.exports = router;