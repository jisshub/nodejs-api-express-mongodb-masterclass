const express = require("express");
const {
    getReviews
} = require("../controllers/reviews");

const router = express.Router()

// routes
router.route("/").get(getReviews);

// export the router
module.exports = router;