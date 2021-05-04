// E.C: 04-01-2021 - User Authentication
// E.C: 04-10-2021 - Worked on returning messages 
const LocalStrat = require ('passport-local').Strategy;
const bcrypt = require ('bcrypt');
const User = require ('../models/UserModel.js');

module.exports = function(passport){
    passport.use(
        new LocalStrat({usernameField: 'email'}, (email,password,done)=>{
            // Match user by email - Is there an account under that email?
            User.findOne({email: email})
            .then((user)=>{
                if(!user) {
                    console.log('Email is not registered. ' + email);
                    return done(null, false, {message: 'Email is not registered.' + email});
                }
                // Match password to account - Is the password correct?
                bcrypt.compare(password, user.password, (err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch) {
                        console.log('Logged in! Hey ' + user.name);
                        return done(null,user);
                    } else {
                        console.log('Incorrect password. ');
                        return done(null, false, {message: 'Incorrect password.'});
                    }
                })
            })
            .catch((err)=> {console.log(err)})
        }))
        // Maintains the login sessions
        passport.serializeUser((user, done) =>{
            done(null, user.id);
        });
        passport.deserializeUser((id, done)=>{
            User.findById(id, (err, user)=>{
                done(err, user);
        })});
};