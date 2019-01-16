const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    age: {
        type: Number
    },
    skills: [String],
    photo: [
        {
            path:{
                type: String
            },
            profile:{
                type: Boolean,
                default: false
            }
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);