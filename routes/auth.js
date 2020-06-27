const express = require('express');
const {
    register,
    login,
    getMe,
    forgotPassword,
    passwordReset,
    updateUserDetails,
    updatePassword,
} = require('../controllers/auth');

const {
    protect
} = require('../middleware/auth');
const {
    route
} = require('./courses');
const {
    getAllUsers,
    getSingleUser,
    updateUser,
    removeUser
} = require('../controllers/users');
const {
    updateACourse
} = require('../controllers/courses');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(passwordReset);
router.route('/updatedetails').put(protect, updateUserDetails);
router.route('/updatepassword').put(protect, updatePassword);

module.exports = router;