const knex = require("knex")(require("../knexfile"));

const handleDonation = async (req, res) => {
  const userId = req.userId;
  const { requestId } = req.params;
  const { buttonClicked, donorsResponded, donorsDonated } = req.body;

  try {
    const existingResponse = await knex("donation_status")
      .where({ request_id: requestId, user_id: userId })
      .first();

    if (!existingResponse) {
      await knex("donation_status").insert({
        request_id: requestId,
        user_id: userId,
        donor_responded: buttonClicked === "respond" ? 1 : 0,
        donor_donated: buttonClicked === "confirm" ? 1 : 0,
      });
    } else {
      const updateData = {
        donor_responded: existingResponse.donor_responded,
        donor_donated: existingResponse.donor_donated,
      };

      if (buttonClicked === "respond") {
        updateData.donor_responded = 1;
      } else if (buttonClicked === "confirm") {
        updateData.donor_donated = 1;
      }

      await knex("donation_status")
        .where({ request_id: requestId, user_id: userId })
        .update(updateData);
    }

    const respondedCountData = await knex("donation_status")
      .where({ request_id: requestId, donor_responded: 1 })
      .count("id as count");

    const donatedCountData = await knex("donation_status")
      .where({ request_id: requestId, donor_donated: 1 })
      .count("id as count");

    const donorRespondedCount = respondedCountData[0].count;
    const donorDonatedCount = donatedCountData[0].count;

    // Construct the response data
    const responseData = {
      postId: requestId, // Adjust this based on your actual data structure
      donorRespondedCount,
      donorDonatedCount,
      buttonClicked,
      donorsResponded,
      donorsDonated,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Failed to handle donation:", error);
    res.status(500).json({ error: "Failed to handle donation" });
  }
};

module.exports = {
  handleDonation,
};
