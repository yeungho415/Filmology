const express = require("express");
const router = express.Router({mergeParams: true}); 
const Filmspot = require("../models/filmspot");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const catchAsync = require("../helpers/catchAsync");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;