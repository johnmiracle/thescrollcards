const express = require("express");
const router = express.Router();
const mainController = require("../controller/mainController");
const { isAuthenticated } = require("../controller/authController");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "theScrollCard.com" });
});

router.get("/cart", mainController.cart);
router.get("/addtocart/:id", mainController.addCart);
router.get("/addbyone/:id", mainController.addOne);
router.get("/reducebyone/:id", mainController.removeOne);
router.get("/remove/:id", mainController.removeCart);
router.get("/login", mainController.showLogin);
router.get("/logout", mainController.logout);
router.get("/register", mainController.signup);
router.post("/login", mainController.login);
router.get("/product", mainController.product);
router.get("/product/:id", mainController.productId);
router.post("/register", mainController.memberRegister);
router.get("/small_polish_paper_scroll", mainController.smallPolishScroll)
router.get("/medium_polish_paper_scroll", mainController.mediumPolishScroll)
router.get("/big_polish_paper_scroll", mainController.bigPolishScroll)
router.get("/small_velvet_paper_scroll", mainController.smallVelvetScroll)
router.get("/medium_velvet_paper_scroll", mainController.mediumVelvetScroll)
router.get("/big_velvet_paper_scroll", mainController.bigVelvetScroll)
router.get("/luxury_scroll", mainController.luxuryScroll)
router.get("/velvet_scroll", mainController.velvetScroll);
router.get("/polish_scroll", mainController.polishScroll);



router.use(isAuthenticated)

router.get("/checkout", mainController.checkout);
router.post("/paystack/pay", mainController.payStack);
router.get("/payment_return", mainController.payment_return);


module.exports = router;
