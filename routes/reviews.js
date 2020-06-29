const express = require("express");
const {
    getReviews,
    getSingleReview
} = require("../controllers/reviews");

const router = express.Router({
    mergeParams: true
})

// routes
router.route("/").get(getReviews);
router.route("/:id").get(getSingleReview)

// export the router
module.exports = router;