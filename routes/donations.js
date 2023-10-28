const router = require("express").Router();
const donationsController = require("../controllers/donations-controller");

router.route("/:requestId").post(donationsController.handleDonation);

module.exports = router;
