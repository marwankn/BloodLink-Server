const axios = require("axios");
require("dotenv").config();

async function getCoordinatesFromAddress(address) {
  try {
    const formattedAddress = address.replace("", "+");

    const geocodingURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${process.env.MAPS_API}`;

    const response = await axios.get(geocodingURL);

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return location;
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    throw error;
  }
}
module.exports = getCoordinatesFromAddress;
