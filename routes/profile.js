const router = require("express").Router();
const profileController = require("../controllers/profile-controller");

router
  .route("/")
  .get(profileController.getProfile)
  .post(profileController.addProfile)
  .put(profileController.editProfile);
module.exports = router;
