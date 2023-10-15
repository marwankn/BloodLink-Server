const router = require("express").Router();
const requestsController = require("../controllers/requests-controller");

router
  .route("/")
  .get(requestsController.getRequests)
  .post(requestsController.addRequest);
module.exports = router;
