const User = require('../models/user.model');
const Drink = require('../models/drink.model');
const Password = require('../config/password');

exports.init = (req, res) => {

    //Ajout user
    let pwd = new Password('azerty');
    const ash = new User({
        lastname: 'Febvre',
        firstname: 'Sylvain',
        username: 'Ashlook',
        date_ins: new Date(),
        balance: 0,
        password: pwd.hash,
        salt: pwd.salt,
        admin: true,
        active: true,
    });
    ash.save((err) => {
        if(err) throw err;
    })

    pwd = new Password('azerty');
    const gne = new User({
        lastname: 'Claude',
        firstname: 'Jean',
        username: 'Trou',
        date_ins: new Date(),
        balance: 0,
        password: pwd.hash,
        salt: pwd.salt,
        admin: false,
        active: true,
    });
    gne.save((err) => {
        if(err) throw err;
    })

    pwd = new Password('azerty');
    const dballe = new User({
        lastname: 'Claude',
        firstname: 'Jean',
        username: 'Dballe',
        date_ins: new Date(),
        balance: 0,
        password: pwd.hash,
        salt: pwd.salt,
        admin: false,
        active: true,
    });
    dballe.save((err) => {
        if(err) throw err;
    })

    pwd = new Password('azerty');
    const hehe = new User({
        lastname: 'Claude',
        firstname: 'Jean',
        username: 'hehe',
        date_ins: new Date(),
        balance: 0,
        password: pwd.hash,
        salt: pwd.salt,
        admin: false,
        active: true,
    });
    hehe.save((err) => {
        if(err) throw err;
    })

    res.send('Data added !');

}