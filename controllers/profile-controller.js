const knex = require("knex")(require("../knexfile"));
const getCoordinatesFromAddress = require("../utils/getCoordinatesFromAddress");

const getProfile = (req, res) => {
  const userId = req.userId;

  knex("profile")
    .select()
    .where("user_id", userId)
    .first()
    .then((profile) => {
      if (profile) {
        const date = new Date(profile.last_donation);
        profile.last_donation = date.toISOString().split("T")[0];
        res.status(200).json(profile);
      } else {
        res.status(404).json({ error: "Profile not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to fetch profile" });
    });
};

const addProfile = async (req, res) => {
  const userId = req.userId;
  const profileData = req.body;
  profileData.user_id = userId;

  try {
    const existingProfile = await knex("profile")
      .where({ user_id: userId })
      .first();
    if (existingProfile) {
      return res
        .status(400)
        .json({ error: "Profile already exists for this user" });
    }

    const coordinates = await getCoordinatesFromAddress(profileData.address);

    profileData.latitude = coordinates.lat;
    profileData.longitude = coordinates.lng;
    profileData.number_of_donations = 0;
    knex("profile")
      .insert(profileData)
      .then((success) => {
        res.status(201).json({ message: "Profile added successfully" });
      });
  } catch (error) {
    res.status(500).json({ error: "Failed to add profile" });
  }
};

const editProfile = async (req, res) => {
  const userId = req.userId;
  const profileData = req.body;
  const address = profileData.address;

  try {
    const currentProfile = await knex("profile")
      .where("user_id", userId)
      .first();

    if (currentProfile.address !== address) {
      const coordinates = await getCoordinatesFromAddress(address);
      profileData.latitude = coordinates.lat;
      profileData.longitude = coordinates.lng;
    }

    knex("profile")
      .where("user_id", userId)
      .update(profileData)
      .then((data) => console.log(data));

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

module.exports = {
  getProfile,
  addProfile,
  editProfile,
};
