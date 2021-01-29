const {Router} = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const router = Router();
const User = require('../models/user');
const passport = require('passport');


router.get('/signup', (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        isSignup: true
    });
});

router.get('/signin', (req, res) => {
    var flashErrors = [{ msg: req.flash('error')[0] }]
    if (!flashErrors[0].msg)
        flashErrors = null

    res.render('signin', {
        title: "Sign In",
        isSignin: true,
        errors: flashErrors,
        successMessage: req.flash('success')[0]
    });
})

router.post('/signin', 
(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        res.render('signin', {
            title: "Sign In",
            isSignin: true,
            errors: errors.array()
        })
        return;
    }

    passport.authenticate('local', {
        successRedirect: '/addphoto',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);

});

router.post('/signup', 
[
    check('password').isLength({min: 6}).withMessage("Password have to contains 6 symbols and more"),
    check('login').notEmpty().withMessage("Enter username")
], 
(req, res) => {
    const login = req.body.login
    const password = req.body.password
    console.log(login)
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        res.render('signup', {
            title: "Sign In",
            isSignin: true,
            errors: errors.array()
        })
        return
    }

    let user = new User({
        login: login,
        password: password
    })

    bcrypt.genSalt(7, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash;
            user.save((err) => {
                if (err)
                {
                    var regErrors = [];
                    if (err.keyPattern.login)
                        regErrors.push({msg: 'The same login already exsist'});
                    console.log(err);
                    res.render('signup', {
                        title: "Sign In",
                        isSignin: true,
                        errors: regErrors
                    });
                }
                else 
                {
                    req.flash('success', 'Your account successfuly created!');
                    res.redirect('/signin');
                }
            });
        });
    });
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;