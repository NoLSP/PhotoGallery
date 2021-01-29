const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport)
{
    passport.use('local', new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },(username, password, done) => {
        let query = { login: username };
        console.log(query);
        User.findOne(query, (err, user) => {
            if (!user)
                return done(null, false, { message: 'The same login already registered' });
            bcrypt.compare(password, user.password, (err, success) => {
                if (success)
                    return done(null, user);
                else
                    return done(null, false, { message: 'Wrong login or password' });
            });
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
}