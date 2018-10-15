const e = require('../config/error').ErrorHandler();
const User = require('../models/user.model');
const Password = require('../config/password');

module.exports = {
  /**
   * Creation utilisateur en post
   * @param {*} req 
   * @param {*} res 
   */
  create: (req, res) => {
    /*
    req.body :
    {
        username: String,
        password: String,
        passwordCheck: String,
        lastname: String,
        firstname: String,
    }
    */
    //Verification que l'utilisateur n'est pas deja enregistré
    User.findOne({ username: new RegExp(req.body.username, 'i') }, (err, user) => {
      if (user) return res.status(400).json(e.handleError(e.USER_ALREADY_EXISTS));
      const pwdPlain = req.body.password;
      const pwdCheck = req.body.passwordCheck;
      //Verif de la longueur
      if (pwdPlain.length < 8) return res.status(400).json(e.handleError(e.PASSWORD_TOO_SHORT));
      //Verification que le mot de passe et la verif sont correct
      if (pwdPlain !== pwdCheck) return res.status(400).json(e.handleError(e.PASSWORD_DIFFERS));
      //Hashage du mdp
      const pwd = new Password(pwdPlain);
      const newUser = new User({
        lastname: req.body.lastname,
        firstname: req.body.firstname,
        username: req.body.username,
        date_ins: new Date(),
        balance: 0,
        password: pwd.hash,
        salt: pwd.salt,
        admin: false,
        active: false,
      });
      newUser.save((err) => {
        if (err) return res.status(400).json(e.handleError(err));

        return res.status(200).json({
          success: true,
          message: 'Utilisateur créé',
          user: newUser
        });
      });
    })
  },

  /**
   * Recupere la liste des utilisateurs
   * On ne recupere pas la liste des tournée pour chaque utilisateur
   * @param {*} req 
   * @param {*} res 
   */
  findAll: (req, res) => {
    User.find()
      .sort({ active: -1, balance: 1 })
      .exec((err, users) => {
        if (err) return res.status(400).json(e.handleError(err));
        if (!users[0]) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
        return res.status(200).json({
          success: true,
          message: 'Utilisateurs trouvés',
          users: users
        });
      })
  },

  /**
   * Recupere la liste des utilisateurs actifs
   * On ne recupere pas la liste des tournée pour chaque utilisateur
   * @param {*} req 
   * @param {*} res 
   */
  findAllActive: (req, res) => {
    User.find({ 'active': true })
      .sort({ username: 1 })
      .exec((err, users) => {
        if (err) return res.status(400).json(e.handleError(err));
        if (!users[0]) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
        return res.status(200).json({
          success: true,
          message: 'Utilisateurs trouvés',
          users: users
        });
      })
  },

  /**
   * Recherche utilisateur par username
   * @param {*} req 
   * @param {*} res 
   */
  findByUsername: (req, res) => {
    User.findOne({ username: new RegExp(req.params.username, 'i') })
      .populate({
        path: 'paid_drink',
        populate: [{
          path: 'user'
        }, {
          path: 'drinkers',
          options: { sort: { 'username': 1 } }
        }],
        options: { sort: { date_drink: -1, date_add: -1 } }
      })
      .exec((err, user) => {
        if (err) return res.status(400).json(e.handleError(err));
        if (!user) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
        return res.json({
          success: true,
          message: 'Utilisateur trouvé',
          user: user
        });
      })
  },

  /**
   * Mis à jour de l'utilisateur (post)
   * @param {*} req 
   * @param {*} res 
   */
  updateInfo: (req, res) => {
    /*
    req.body :
    {
        id: String,
        lastname: String,
        firstname: String,
        password: String
    }
    */
    //Recuperation de l'utilisateur
    User.findById(req.payload.id)
      .select('+password')
      .select('+salt')
      .exec((err, user) => {
        if (err) return res.status(400).json(e.handleError(err));
        if (!user) return res.status(400).json(e.handleErrore(e.USER_NOT_FOUND));
        //User trouvé, on verifie si c'est bien le même que celui authentifié
        if (user.username !== req.payload.username) return res.status(403).json(e.handleError(e.USER_DIFFERS));
        //Verification du mdp
        if (!Password.Check(user.password, user.salt, req.body.password)) return res.status(401).json(e.handleError(e.WRONG_PASSWORD));
        //Tout est bon, on met à jour les données
        user.lastname = req.body.lastname;
        user.firstname = req.body.firstname;
        user.save(err => {
          if (err) return res.status(400).json(e.handleError(err));
          return res.status(200).json({
            success: true,
            message: 'Utilisateur mis à jour',
            user: null
          });
        });
      });
  },

  /**
   * Mis à jour du mdp de l'utilisateur (post)
   * @param {*} req 
   * @param {*} res 
   */
  updatePassword: (req, res) => {
    /*
    req.body : {
        password: String,
        newPassword: String,
        newPasswordCheck: String
    }
    */
    //Recuperation de l'utilisateur
    User.findById(req.payload.id)
      .select('+password')
      .select('+salt')
      .exec((err, user) => {
        if (err) return res.status(400).json(e.handleError(err));
        if (!user) return res.status(400).json(e.handleErrore(e.USER_NOT_FOUND));
        //User trouvé, on verifie si c'est bien le même que celui authentifié
        if (user.username !== req.payload.username) return res.status(403).json(e.handleError(e.USER_DIFFERS));
        //Verification du mdp
        if (!Password.Check(user.password, user.salt, req.body.password)) return res.status(401).json(e.handleError(e.WRONG_PASSWORD));
        const newPlain = req.body.newPassword;
        const newCheckPlain = req.body.newPasswordCheck;
        //Verif de la longueur
        if (newPlain.length < 8) return res.status(400).json(e.handleError(e.PASSWORD_TOO_SHORT));
        //Vérification du nouveau mdp
        if (newPlain !== newCheckPlain) return res.status(400).json(e.handleError(e.PASSWORD_DIFFERS));
        //Hashage du nouveau mdp
        const newPassword = new Password(newPlain);
        user.password = newPassword.hash;
        user.salt = newPassword.salt;
        user.save(err => {
          if (err) return res.status(400).json(e.handleError(err));
          return res.status(200).json({
            success: true,
            message: 'Mot de passe mis à jour',
            user: null
          });
        });
      });
  },

  /**
   * Check if logged user is active
   * @returns Boolean
   */
  isActive: (req, res) => {
    User.findById(req.payload.id)
      .exec((err, user) => {
        if (err) return res.status(400).json(e.handleError(err));
        if (!user) return res.status(400).json(e.handleError(e.USER_NOT_FOUND));
        console.log(user.active);
        return res.status(200).json({
          success: true,
          message: 'Utilisateur trouvé',
          active: user.active
        });
      })
  }
}
