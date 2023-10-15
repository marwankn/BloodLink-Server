const knex = require("knex")(require("../knexfile"));
const getCompatibleBloodTypes = require("../utils/getCompatibleBloodTypes");
const getCoordinatesFromAddress = require("../utils/getCoordinatesFromAddress");

const addRequest = async (req, res) => {
  const userId = req.userId;
  const { patient_name, blood_type_needed, number_of_donors_needed, address } =
    req.body;

  try {
    const coordinates = await getCoordinatesFromAddress(address);

    const request = {
      user_id: userId,
      patient_name,
      blood_type_needed,
      number_of_donors_needed,
      address,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };

    // Insert the request into the database
    const [requestId] = await knex("requests").insert(request);

    res
      .status(201)
      .json({ id: requestId, message: "Request added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add request" });
  }
};

const getRequests = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  try {
    console.log("1");
    const profileData = await knex("profile")
      .select(
        "latitude",
        "longitude",
        "travel_radius_for_donation",
        "blood_type",
        // "sex",
        "last_donation"
      )
      .where({ user_id: userId })
      .first();
    console.log("2");
    if (!profileData) {
      return res.status(404).json({ error: "User profile not found" });
    }
    console.log("3");
    const {
      latitude,
      longitude,
      travel_radius_for_donation,
      blood_type,
      sex,
      last_donation,
    } = profileData;
    console.log("4");

    // Calculate the days left for eligibility based on sex and last_donation date
    const today = new Date();
    const lastDonationDate = new Date(last_donation);
    const daysBetweenDonations = sex === "m" ? 56 : 84;
    const eligibleDate = new Date(
      lastDonationDate.getTime() + daysBetweenDonations * 24 * 60 * 60 * 1000
    );
    console.log("5");
    if (today < eligibleDate) {
      // User is not eligible to donate yet
      const daysLeft = Math.ceil(
        (eligibleDate - today) / (24 * 60 * 60 * 1000)
      );
      return res.status(200).json({
        message: `You're not eligible to donate again yet! Please come back in ${daysLeft} days.`,
      });
    }
    console.log("6");

    // User is eligible to donate, proceed with finding donation requests

    const maxDistance = travel_radius_for_donation / 111.32;

    const compatibleBloodTypes = getCompatibleBloodTypes(blood_type);
    console.log("7");

    const requests = await knex("requests")
      .select("*")
      .where((queryBuilder) => {
        queryBuilder
          .whereBetween("latitude", [
            latitude - maxDistance,
            latitude + maxDistance,
          ])
          .andWhereBetween("longitude", [
            longitude - maxDistance,
            longitude + maxDistance,
          ])
          .whereIn("blood_type_needed", compatibleBloodTypes)
          .where("user_id", "!=", userId); // Exclude requests from the same user
      });
    console.log("8");

    if (requests.length === 0) {
      return res.status(200).json({
        message:
          "No donation requests were found. You can adjust the travel distance radius to check if there are other requests around you.",
      });
    }
    console.log("9");

    return res.status(200).json({ requests });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch requests" });
  }
};

module.exports = {
  addRequest,
  getRequests,
};
