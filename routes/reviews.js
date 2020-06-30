const express = require("express");
const {
    getReviews,
    getSingleReview,
    createReview,
    updateReview
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
router.route("/:id").get(getSingleReview).put(updateReview)

// export the router
module.exports = router;