const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const { isAuthenticated, checkUser, checkIn } = require("../controller/authController");

/* GET home page. */
router.get("/", checkUser, function (req, res, next) {
  res.render("index", { title: "theScrollCard.com" });
});

router.get("/contact", mainController.contact);
router.post("/contact", mainController.contactUs);
router.get("/cart", checkUser, mainController.cart);
router.get("/addtocart/:id", checkUser, mainController.addCart);
router.get("/addbyone/:id", checkUser, mainController.addOne);
router.get("/reducebyone/:id", checkUser, mainController.removeOne);
router.get("/remove/:id", checkUser, mainController.removeCart);
router.get("/login", checkIn, mainController.showLogin);
router.post("/login", mainController.login);
router.get("/register", checkUser, checkIn, mainController.signup);
router.post("/register", checkUser, mainController.memberRegister);
router.get("/logout", mainController.logout);
router.get("/product", checkUser, mainController.product);
router.get("/product/:id", checkUser, mainController.productId);
router.get("/small_polish_paper_scroll", checkUser, mainController.smallPolishScroll);
router.get("/medium_polish_paper_scroll", checkUser, mainController.mediumPolishScroll);
router.get("/big_polish_paper_scroll", checkUser, mainController.bigPolishScroll);
router.get("/small_velvet_paper_scroll", checkUser, mainController.smallVelvetScroll);
router.get("/medium_velvet_paper_scroll", checkUser, mainController.mediumVelvetScroll);
router.get("/big_velvet_paper_scroll", checkUser, mainController.bigVelvetScroll);
router.get("/luxury_scroll", checkUser, mainController.luxuryScroll);
router.get("/velvet_scroll", checkUser, mainController.velvetScroll);
router.get("/polish_scroll", checkUser, mainController.polishScroll);
router.get("/checkout", isAuthenticated, checkUser, mainController.checkout);
router.get("/price_quote", checkUser, mainController.getQuote);
router.post("/stock_quote", checkUser, mainController.quote);
router.post("/paystack/pay", isAuthenticated, checkUser, mainController.payStack);
router.get("/payment_return", isAuthenticated, checkUser, mainController.payment_return);

module.exports = router;
