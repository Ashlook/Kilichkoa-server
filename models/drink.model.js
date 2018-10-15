const mongoose = require('mongoose');
const User = require('./user.model');

const drinkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    drinkers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }],
    date_drink: {
        type: Date,
        required: true
    },
    date_add: Date
});

module.exports = mongoose.model('Drink', drinkSchema);