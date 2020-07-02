const express = require("express");
const {
    getReviews,
    getSingleReview,
    createReview,
    updateReview,
    deleteReview
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

router.route("/:id").get(getSingleReview).put(protect, authorize('user'), updateReview).delete(protect, authorize('user'), deleteReview);

// export the router
module.exports = router;