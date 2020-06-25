const express = require("express");
const {
    register,
    login,
    getMe,
    forgotPassword,
    passwordReset
} = require("../controllers/auth");

const {
    protect
} = require("../middleware/auth");
const {
    route
} = require("./courses");

const router = express.Router();

router.route('/register').post(register)
router.route('/login').post(login)
router.route("/me").get(protect, getMe)
router.route("/forgotpassword").post(forgotPassword)
router.route('/resetpassword/:resettoken').put(passwordReset);

module.exports = router;