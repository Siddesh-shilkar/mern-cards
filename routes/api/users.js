const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const keys = require('../../config/keys').secretOrKey;
const passport = require('passport');

//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route GET api/users/test
// @desc Test post route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Users Works"}));

// @route GET api/users/register
// @desc Register User
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if(user){
                return res.status(400).json({email: 'Email already exist'});
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err){
                            throw err;
                        }else{
                            newUser.password = hash;
                            newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                        }
                    })
                })
            }
        })
});

// @route GET api/users/login
// @desc Login User / return Token
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //find the user using email
    User.findOne({email})
        .then(user => {
            //check for user
            if(!user){
                errors.email = 'User not found';
                return res.status(404).json(errors)
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        //User Matched
                        const payload = { id: user.id, name: user.name }

                        //Sign Token
                        jwt.sign(
                            payload, 
                            keys, 
                            { expiresIn: 3600 }, 
                            (err, token) => {
                                res.json({success: true, token: 'Bearer ' + token})
                        });
                    }else{
                        error.password = 'Password Incorrect';
                        return res.status(400).json(errors);
                    }
                })
        });
});

// @route GET api/users/current
// @desc Return current User
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }),
    (req, resp) => {
        resp.json({
            id: req.user._id,
            name: req.user.name,
            email: req.user.email
        });
    }
);

module.exports = router;