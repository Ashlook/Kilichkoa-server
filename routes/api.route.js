const router = require('express').Router();
const jwtCheck = require('./jwt.middleware');
const userCtrl = require('../controllers/user.controller');
const initCtrl = require('../controllers/init.controller');
const drinkCtrl = require('../controllers/drink.controller');
const adminRoutes = require('./admin.route');

//Users
//Create
router.post('/user/create', userCtrl.create);
//Read
router.get('/user/get/all', userCtrl.findAll);

router.get('/user/get/1/:username', userCtrl.findByUsername);
//Read
router.get('/drink/get/all', drinkCtrl.findAll);

router.get('/drink/get/:id', drinkCtrl.findById);

/***********
 * User must be logged in, we need to check the jwt 
 ***********/
router.use(jwtCheck);

router.get('/user/check/active', userCtrl.isActive);

router.get('/user/get/active', userCtrl.findAllActive);
//Update
router.post('/user/update/info', userCtrl.updateInfo);
router.post('/user/update/pwd', userCtrl.updatePassword);
//Delete

//Drinks
router.get('/drink/getByDrinker', drinkCtrl.findByDrinker);
//Create
router.post('/drink/create', drinkCtrl.create);
//Update

//Delete
router.get('/drink/delete/:id', drinkCtrl.delete);

//Admin
router.use('/admin', adminRoutes);
//Init
router.get('/init', initCtrl.init);

module.exports = router;