const router = require("express").Router();
const requestsController = require("../controllers/requests-controller");

router
  .route("/")
  .get(requestsController.getRequests)
  .post(requestsController.addRequest);

router.route("/:requestId").get(requestsController.getCount);
module.exports = router;
