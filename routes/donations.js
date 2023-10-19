const router = require("express").Router();
const donationsController = require("../controllers/donations-controller");

router
  .route("/initialize/:requestId")
  .post(donationsController.donorResponseAdd);
router.route("/respond/:requestId").put(donationsController.donorResponded);
router.route("/confirm/:requestId").put(donationsController.donorDonated);
router.route("/count/:requestId").get(donationsController.totalCount);
module.exports = router;
