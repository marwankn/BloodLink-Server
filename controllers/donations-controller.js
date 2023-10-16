const knex = require("knex")(require("../knexfile"));

const donorResponseAdd = async (req, res) => {
  const userId = req.userId;
  const { requestId } = req.params;
  const { buttonClicked } = req.body;
  const donorResponded = buttonClicked === "respond" ? 1 : 0;
  const donorDonated = buttonClicked === "confirm" ? 1 : 0;
  try {
    const response = await knex("donation_status").insert({
      request_id: requestId,
      user_id: userId,
      donor_responded: donorResponded,
      donor_donated: donorDonated,
    });

    return res.status(201).json({ message: "Donation response initialized" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Failed to initialize donation response" });
  }
};

const donorResponded = async (req, res) => {
  const userId = req.userId;
  const { requestId } = req.params;

  try {
    const existingResponse = await knex("donation_status")
      .where({ request_id: requestId, user_id: userId })
      .first();

    if (!existingResponse) {
      await knex("donation_status").insert({
        request_id: requestId,
        user_id: userId,
        donor_responded: true,
        donor_donated: false,
      });
    } else {
      await knex("donation_status")
        .where({ request_id: requestId, user_id: userId })
        .update({ donor_responded: !existingResponse.donor_responded });
    }

    return res.status(200).json({ message: "Response updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update response" });
  }
};

const donorDonated = async (req, res) => {
  const { userId } = req;
  const { requestId } = req.params;

  try {
    const existingResponse = await knex("donation_status")
      .where({ request_id: requestId, user_id: userId })
      .first();

    if (existingResponse && existingResponse.donor_responded) {
      await knex("donation_status")
        .where({ request_id: requestId, user_id: userId })
        .update({ donor_responded: false, donor_donated: true });

      return res
        .status(200)
        .json({ message: "Donation confirmed successfully" });
    } else {
      return res.status(400).json({
        error:
          "You must respond to the request before confirming the donation.",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to confirm donation" });
  }
};

const totalCount = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const respondedCount = await knex("donation_status")
      .where({ request_id: requestId, donor_responded: 1 })
      .count("id as count")
      .first();

    const donatedCount = await knex("donation_status")
      .where({ request_id: requestId, donor_donated: 1 })
      .count("id as count")
      .first();

    const donorRespondedCount = respondedCount.count;
    const donorDonatedCount = donatedCount.count;

    res.json({ donorRespondedCount, donorDonatedCount });
  } catch (error) {
    console.error("Failed to count donor status:", error);
    res.status(500).json({ error: "Failed to count donor status" });
  }
};
module.exports = {
  donorResponseAdd,
  donorResponded,
  donorDonated,
  totalCount,
};
