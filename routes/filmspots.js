const express = require("express");
const router = express.Router();
const filmspots = require("../controllers/filmspots")
const catchAsync = require("../helpers/catchAsync");
const { isLoggedIn, isAuthor, validatefilmspot } = require("../middleware");
const multer = require("multer")
const { storage } = require("../cloudinary")
const upload = multer({ storage: storage })


router.route("/")
    .get(catchAsync(filmspots.index))
    .post(isLoggedIn, upload.array("image"), validatefilmspot, catchAsync(filmspots.createSpot))
    // .post(upload.array("image"), (req, res) => {
    //     console.log(req.body, req.files)
    // })



router.get("/new", isLoggedIn, filmspots.renderNewForm)


router.route("/:id")
    .get(catchAsync(filmspots.showSpot))
    .put(isLoggedIn, isAuthor, upload.array("image"), validatefilmspot, catchAsync(filmspots.updateSpot))
    .delete(isLoggedIn, isAuthor, catchAsync(filmspots.deleteSpot))



router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(filmspots.renderEditForm))





module.exports = router;