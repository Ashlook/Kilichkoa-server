const e = require('../config/error').ErrorHandler();
const Drink = require('../models/drink.model');
const User = require('../models/user.model');

module.exports = {
    /**
     * Creation tournée avec maj de la balance de chaque utilisateurs present
     * Il faut l'id du payeur et l'id des presents
     * @param {*} req 
     * @param {*} res 
     */
    create: (req, res) => {
        /* req.body : 
        {
            user: User
            price: Number,
            date_drink: Date,
            drinkers: User[],
        }*/
        //Si pas actif pas le droit d'ajouter
        if (!req.payload.active) return res.status(401).json(e.handleError(e.NOT_ACTIVE));
        //Si il n'est pas admin, pas la droit d'ajouter pour quelqu'un d'autre
        if (!req.payload.admin && req.body.user.username !== req.payload.username) return res.status(401).json(e.handleError(e.USER_DIFFERS));
        //Creation de la tournée.
        const drink = new Drink({
            user: req.body.user,
            price: req.body.price,
            date_drink: req.body.date_drink,
            date_add: new Date()
        });
        drink.drinkers.push(...req.body.drinkers);
        drink.save(err => {
            if (err) return res.status(400).json(e.handleError(err))
            //calcul du prix par personnes
            const ppp = req.body.price / req.body.drinkers.length;
            //MAJ de la balance du payeur.

            User.findById(req.body.user, (err, user) => {
                if (err) return res.status(400).json(e.handleError(err));
                if (!user) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
                user.balance += req.body.price;
                user.save(async (err) => {
                    if (err) return res.status(400).json(e.handleError(err));
                    //MAJ de la balance des buveurs
                    for (const user of req.body.drinkers) {
                        await User.findById(user, async (err, user) => {
                            if (err) return res.status(400).json(e.handleError(err));
                            if (!user) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
                            user.balance -= ppp;
                            await user.save(err => {
                                if (err) return res.status(400).json(e.handleError(err));
                            });
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        message: 'Tournée ajoutée',
                        drink
                    });
                });
            })
        });
    },

    /**
     * Recupere la liste des tournées
     * @param {*} req 
     * @param {*} res 
     */
    findAll: (req, res) => {
        Drink.find()
            .populate('user')
            .populate({
                path: 'drinkers',
                options: { sort: { 'username': 1 } }
            })
            .sort({ date_drink: -1, date_add: -1 })
            .exec((err, drinks) => {
                if (err) return res.status(400).json(e.handleError(err));
                if (!drinks[0]) return res.status(400).json(e.handleError(e.DRINK_NOT_FOUND));
                return res.status(200).json({
                    success: true,
                    message: 'Tournées trouvées',
                    drinks: drinks
                });
            })
    },

    /**
     * Recupere une tournée via son Oid 
     * On peuple la liste des buveurs
     */
    findById: (req, res) => {
        Drink
            .findById(req.params.id)
            .populate('user')
            .populate('drinkers')
            .exec((err, drink) => {
                if (err) return res.status(400).json(e.handleError(err));
                if (!drink) return res.status(400).json(e.handleError(e.DRINK_NOT_FOUND));
                return res.status(200).json({
                    success: true,
                    message: 'Tournée trouvée',
                    drink: drink
                });
            });
    },

    /**
     * Suppresion d'une tournée avec MAJ des users
     */
    delete: (req, res) => {
        Drink
            .findById(req.params.id)
            .populate('user')
            .populate('drinkers')
            .exec((err, drink) => {
                if (err) return res.status(400).json(e.handleError(err));
                if (!drink) return res.status(400).json(e.handleError(e.DRINK_NOT_FOUND));
                //Seulement l'admin peut supprimer on peut check le payload au lieu de faire une requete en base vu que
                //le jwt à été vérifié
                if (!req.payload.admin) return res.status(403).json(e.handleError(e.NOT_ADMIN));
                //MAJ des buveurs
                const ppp = drink.price / drink.drinkers.length;

                const users = drink.drinkers;
                Promise.all(users.map(u => {
                    u.balance += ppp;
                    return u.save()
                })).then(() => {
                    //MAJ du payeur on le recupere en base vu qu'il a peu etre été modifié dans la maj des buveurs
                    User.findById(drink.user, (err, user) => {
                        if (err) return res.status(400).json(e.handleError(err));
                        if (!user) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
                        user.balance -= drink.price;
                        user.save(err => {
                            if (err) return res.status(400).json(e.handleError(err));
                            //Suppression de la tournée
                            drink.remove(err => {
                                if (err) return res.status(400).json(e.handleError(err));
                                return res.status(200).json({
                                    success: true,
                                    message: 'Tournée supprimée',
                                    drink: drink
                                });
                            });
                        })
                    });
                }).catch(err => res.status(400).json(e.handleError(err)));
            })
    },

    /**
     * Recupere les tournées où un utilisateur a été buveaur
     */
    findByDrinker: (req, res) => {
        Drink.find({ drinkers: req.payload.id })
            .exec((err, drinks) => {
                if (err) return res.status(400).json(e.handleError(err));
                if (!drinks) return res.status(400).json(e.handleError(e.DRINK_NOT_FOUND));
                return res.status(200).json({
                    success: true,
                    message: 'Tournée trouvée',
                    drinks
                });
            });
    },

    /**
     * Mise à jour d'une tournée
     * Pas besoin pour l'instant
     */
    update: (req, res) => {

    }
}