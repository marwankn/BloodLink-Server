const router = require("express").Router();
const usersController = require("../controllers/users-controller");

router.route("/signup").post(usersController.signUpUser);
router.route("/login").post(usersController.loginUser);
module.exports = router;
