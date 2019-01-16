const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const CardSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    cardValue: {
        type: Number,
        required: true
    },
    house: {
        type: String,
        required: true
    },
    onStack: {
        type: Boolean,
        default: false

    }
});

module.exports = Cards = mongoose.model('cards', CardSchema);