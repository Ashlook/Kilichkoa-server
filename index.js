'use strict'
const Password = require('./config/password');
const express = require('express');
const app = express();
const apiRoutes = require('./routes/api.route');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const conf = require('./config/config');
const User = require('./models/user.model');

const db = require('./db/connect');

db.connect();

app.set('jwtSecret', conf.secret);

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Root');
});

app.post('/authenticate', (req, res) => {
    User.findOne({ username: new RegExp(req.body.username, 'i') })
        .select('+password')
        .select('+salt')
        .exec((err, user) => {
            if (err) throw err;

            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Utilisateur introuvable'
                });
            } else {
                //Verif du mdp
                if (!Password.Check(user.password, user.salt, req.body.password)) {
                    res.status(401).json({
                        success: false,
                        message: 'Mauvais mot de passe'
                    });
                } else {
                    const payload = {
                        admin: user.admin,
                        active: user.active,
                        username: user.username,
                        id: user._id
                    };
                    const token = jwt.sign(payload, app.get('jwtSecret'), {
                        expiresIn: 36000
                    });
                    res.json({
                        success: true,
                        message: 'Authentification réussie',
                        token: token,
                        tokenDecoded: jwt.decode(token)
                    });
                }
            }
        });
});

app.listen(conf.port, () => {
    console.log(`Listening on port ${conf.port}...`);
});