const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');


const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + 
            path.extname(file.originalname)
        );
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            callback(null, true)
        }else{
            return callback(new Error('Only images are allowed'))
        }
        
    },
    limits:{
        fileSize: 1280 * 960
    }
}).array('photos', 2);

// @route GET api/profile/test
// @desc Test post route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Profile Works"}));

// @route GET api/profile
// @desc Get current users profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile fo this user'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @route POST api/profile/
// @desc Create or edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    if(!isValid){
        return res.status(404).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;

    if(req.body.age) profileFields.age = req.body.age;

    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    }
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(profile){
                Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true}
                )
                .then(profile => res.json(profile));
            }else{
                new Profile(profileFields).save()
                    .then(profile => res.json(profile));
            }
        })
});

// @route POST api/profile/upload
// @desc Upload photos of the user
// @access Private
router.post('/upload', passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields = {};
    upload(req, res, err => {
        if(err){
            res.status(404).json({msg: 'Image not uploaded'});
        }else{
            let photoArray = req.files;
            let photoPaths = [];

            for(i = 0; i< photoArray.length; i++){
                photoPaths.push({path: photoArray[i].destination + photoArray[i].filename, profile: false});
                sharp(photoArray[i].path)
                    .resize(1280, 960);
            }
            profileFields.photo = photoPaths;

            Profile.findOne({user: req.user.id})
                .then(profile => {
                    if(profile){
                        Profile.findOneAndUpdate(
                            {user: req.user.id},
                            {$set: profileFields},
                            {new: true}
                        )
                        .then(profile => res.json(profile));
                    }else{
                        new Profile(profileFields).save()
                            .then(profile => res.json(profile));
                    }
                })
        }
    });
})

module.exports = router;