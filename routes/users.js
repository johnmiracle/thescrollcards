const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAuthenticated } = require("../controller/authController");

const userController = require("../controller/userController");

router.use(isAuthenticated);

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.get("/orders", userController.order_page);
router.get("/order/view/:id", userController.view_order);

module.exports = router;
