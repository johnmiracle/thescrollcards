const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");


/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", mainController.showLogin);
router.get("/cart", mainController.cart);
router.get("/addtocart/:id", mainController.addCart);
router.get("/addbyone/:id", mainController.addOne);
router.get("/reducebyone/:id", mainController.removeOne);
router.get("/remove/:id", mainController.removeCart);
router.get("/login", mainController.showLogin);
router.get("/logout", mainController.logout);
router.get("/register", mainController.signup);
router.get("/checkout", mainController.checkout);
router.post("/login", mainController.login);
router.get("/product", mainController.product);
router.get("/product/:id", mainController.productId);
router.post("/paystack/pay", mainController.payStack);
router.get("/payment_return", mainController.payment_return);
module.exports = router;
