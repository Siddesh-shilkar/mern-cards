const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../models/User');
const Cards = require('../../models/Cards');


// @route GET api/cards/test
// @desc Test post route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Cards Works"}));


// @route GET api/cards/test
// @desc Test post route
// @access Public
router.get('/', 
    passport.authenticate('jwt', ({session: false})),
    (req, res) => {
        Cards.find({user: req.user.id})
            .then(cards => {
                if(!cards){
                    return res.status(404).json({msg: 'No cards found'})
                }
                res.json(cards);
            })
            .catch(err => res.status(404).json(err));
    });


router.post('/', passport.authenticate('jwt', ({session: false})), (req, res) => {
    const cardDetails = {};
    cardDetails.cardValue = req.body.cardValue;
    cardDetails.house = req.body.house;
    cardDetails.onStack = req.body.onStack;

    new Cards(cardDetails).save()
        .then(cards => res.json(cards));
});

module.exports = router;

