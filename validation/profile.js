const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data){
    let errors = {};

    
    if(data.age && !validator.isInt(data.age, {min: 1, max: 150})){
        errors.age = 'Age is invalid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}