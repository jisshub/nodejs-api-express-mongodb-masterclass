const express = require("express");
const {
    getAllUsers,
    updateUser,
    removeUser,
    createUser,
    getSingleUser
} = require("../controllers/users");
const router = express.Router();

// set routes
router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').put(updateUser).delete(removeUser).get(getSingleUser)