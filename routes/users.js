const express = require("express");
const {
    getAllUsers,
    updateUser,
    removeUser,
    createUser,
    getSingleUser
} = require("../controllers/users");
const {
    protect,
    authorize
} = require("../middleware/auth");
const router = express.Router();

// use protect and authorize middleware for below routes
router.use(protect);
router.use(authorize('admin')); // role should be an admin

// below routes will use protect and authorize. 

// set routes
router.route('/')
    .get(getAllUsers)
    .post(createUser)
router.route('/:id')
    .put(updateUser)
    .delete(removeUser)
    .get(getSingleUser)

module.exports = router