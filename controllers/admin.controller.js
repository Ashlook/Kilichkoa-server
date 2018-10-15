const e = require('../config/error').ErrorHandler();
const Drink = require('../models/drink.model');
const User = require('../models/user.model');

module.exports = {

  isAdmin: (req, res, next) => {
    if (!req.payload.admin) return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
    next();
  },

  setActive: (req, res) => {
    /*
      req.params = {
        userId: OID,
        active: Boolean
      }
    */
    User.findById(req.params.userId)
      .exec((err, user) => {
        if(err) return res.status(400).json(e.handleError(err));
        if(!user) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
        user.active = (req.params.active === 'true') ?  true : false;
        user.save(err => {
          return err 
            ? res.status(400).json(e.handleError(err))
            : res.status(200).json({
              success: true,
              message: 'Status changé - Actif : ' + user.active
            });
        })
      })

  },

  setAdmin: (req, res) => {

  }
}