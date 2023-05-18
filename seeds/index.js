const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Filmspot = require("../models/filmspot");

mongoose.connect("mongodb://localhost:27017/film-spot");


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected")
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Filmspot.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const spot = new Filmspot({
      author: "645f164d3b89d2a533a0055a",
      location: `${cities[random1000].city},  ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ]
      },
      image: [
        {
          url: 'https://res.cloudinary.com/djlkciaid/image/upload/v1684188282/Filmology/k78bhdpg5pxdwcurrxt6.png',
          filename: 'Filmology/k78bhdpg5pxdwcurrxt6',
        },
        {
          url: 'https://res.cloudinary.com/djlkciaid/image/upload/v1684188282/Filmology/b1cp9fy2w47hbzkymcvq.png',
          filename: 'Filmology/b1cp9fy2w47hbzkymcvq',
        }
      ],
      filmUsed: "kodak 200"
    })
    await spot.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})