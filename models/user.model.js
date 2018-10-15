const mongoose = require('mongoose');
const Drink = require('./drink.model');

const userSchema = new mongoose.Schema({
    lastname: {
        type: String,
        required: true,
        // minlength: [2,'Must be at least 2 characters'],
        maxlength: [40, '40 Characters max']
    },
    firstname: {
        type: String,
        required: true,
        // minlength: [2,'Must be at least 2 characters'],
        maxlength: [40, '40 Characters max']
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 3,
    },
    date_ins: Date,
    balance: Number,
    password: {
        type: String,
        required: true,
        select: false
    },
    salt: {
        type: String,
        select: false
    },
    admin: Boolean,
    active: Boolean,
},{
    toJSON: {virtuals: true}
});
userSchema.virtual('paid_drink', {
    ref: 'Drink',
    localField: '_id',
    foreignField: 'user'
})

module.exports = mongoose.model('User', userSchema);