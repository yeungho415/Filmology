const Filmspot = require("../models/filmspot");
const Review = require("../models/review");


module.exports.createReview = async (req, res) => {
    const filmspot = await Filmspot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    filmspot.reviews.push(review);
    await review.save();
    await filmspot.save();
    req.flash("success", "Added a new comment");
    res.redirect(`/filmspots/${filmspot._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Filmspot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Comment deleted")
    res.redirect(`/filmspots/${id}`)
}