const Filmspot = require("../models/filmspot");
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const filmspots = await Filmspot.find({});
    res.render("filmspots/index", { filmspots })
}

module.exports.renderNewForm = (req, res) => {
    res.render("filmspots/new");
}

module.exports.createSpot = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.filmspot.location,
        limit: 1
    }).send() 
    const filmspot = new Filmspot(req.body.filmspot);
    filmspot.geometry = geoData.body.features[0].geometry;
    filmspot.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    filmspot.author = req.user._id;
    await filmspot.save();
    console.log(filmspot)
    req.flash("success", "Successfully made a new spot!");
    res.redirect(`/filmspots/${filmspot._id}`)
}

module.exports.showSpot = async (req, res) => {
    const filmspot = await Filmspot.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!filmspot) {
        req.flash("error", "Spot not found")
        return res.redirect("/filmspots")
    }
    res.render("filmspots/show", { filmspot })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const filmspot = await Filmspot.findById(id)
    if (!filmspot) {
        req.flash("error", "Spot not found")
        return res.redirect("/filmspots")
    }
    res.render("filmspots/edit", { filmspot })
}

module.exports.updateSpot = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const filmspot = await Filmspot.findByIdAndUpdate(id, { ...req.body.filmspot })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    filmspot.image.push(...imgs)
    await filmspot.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await filmspot.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success", "Successfully updated spot")
    res.redirect(`/filmspots/${filmspot._id}`)
}

module.exports.deleteSpot = async (req, res) => {
    const { id } = req.params;
    await Filmspot.findByIdAndDelete(id)
    req.flash("success", "spot deleted")
    res.redirect("/filmspots");
}

module.exports.likeSpot = async (req, res) => {
    let filmspot = await Filmspot.findById(req.params.id);
    if (filmspot.likes.includes(req.user._id)) {
      // User already liked this filmspot, so unlike it
      filmspot.likes.pull(req.user._id);
    } else {
      // User has not yet liked this filmspot, so like it
      filmspot.likes.push(req.user._id);
    }
    await filmspot.save();
    res.redirect(`/filmspots/${filmspot._id}`);
  };
