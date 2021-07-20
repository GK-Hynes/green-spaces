const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const connectDB = require("../db");
const GreenSpace = require("../models/greenSpace");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

// Connect to database
connectDB();

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await GreenSpace.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const green = new GreenSpace({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!"
    });
    await green.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
