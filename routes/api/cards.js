const express = require('express');
const router = express.Router();

// @route GET api/cards/test
// @desc Test post route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Cards Works"}));

module.exports = router;

