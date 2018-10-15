const mongoose = require('mongoose');
const conf = require('../config/config');

module.exports = {
    connect: () => { 
        mongoose.connect(`mongodb://${conf.db.host}:${conf.db.port}/${conf.db.name}`).then(
            () => {
                console.log('Connected to DB...');
            },
            err => {
                console.log('ERROR LOL : ' + err);
            }
        )
    }
}