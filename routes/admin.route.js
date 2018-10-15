const router = require('express').Router();
const adminCtrl = require('../controllers/admin.controller');


//@TODO Check if user is admin
//@TODO UpdateUser
//@TODO UpdateUserPwd ?
//@TODO Delete Drink ?
//@TODO change User status (active/admin)

//A ce niveau la, on sait que l'utilisateur est authentifié, il faut verifier si il est admin
router.use(adminCtrl.isAdmin);

router.get('/set/active/:userId/:active', adminCtrl.setActive);

router.get('/set/admin/:userId/:admin', adminCtrl.setAdmin)





module.exports = router;