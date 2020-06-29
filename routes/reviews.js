const express = require("express");
const {
    getReviews,
    getSingleReview,
    createReview
} = require("../controllers/reviews");
const {
    protect,
    authorize
} = require("../middleware/auth");

const router = express.Router({
    mergeParams: true
})

// routes
router.route("/").get(getReviews).post(protect, authorize('user'), createReview);
router.route("/:id").get(getSingleReview)

// export the router
module.exports = router;