const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { isAuthenticated, checkAccess } = require("../controller/authController");

router.get("/register", adminController.registerView);
router.post("/register", adminController.adminRegister);
router.get("/logout", adminController.logout);

router.use(isAuthenticated, checkAccess);

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/admin-home", adminController.adminHome);
router.get("/add-product", adminController.addproductpage);
router.post("/products/add", adminController.addproduct);
router.get("/add-category", adminController.addcategorypage);
router.post("/category/add", adminController.addcategory);
router.get("/all-products", adminController.products);
router.get("/all-categories", adminController.viewCategory);
router.get("/product/edit/:id", adminController.viewProductEdit);
router.post("/product/edit/:id", adminController.productEdit);
router.get("/category/edit/:id", adminController.viewCategoryEdit);
router.post("/category/edit/:id", adminController.categoryEdit);
router.get("/users", adminController.viewUsers);
router.get("/product/delete/:id", adminController.product_delete);
router.get("/category/delete/:id", adminController.category_delete);
router.get("/orders", adminController.all_Orders);
router.get("/order/view/:id", adminController.view_Order);
router.get("/order/delete/:id", adminController.order_delete);
router.post("/order/update/:id", adminController.order_update);

module.exports = router;
