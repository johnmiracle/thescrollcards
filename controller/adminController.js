const bcrypt = require("bcryptjs");
const Product = require("../models/Products");
const Category = require("../models/Category");
const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Cart = require("../models/cart");
const Order = mongoose.model("Order");
const { check, validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

require("../handlers/cloudinary");
require("dotenv").config();

const backURL = (req) => req.header("Referer");

exports.addproduct = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path);

  // save path in db
  const product = new Product();
  product.name = req.body.name;
  product.code = req.body.code;
  product.category = req.body.category;
  product.size = req.body.size;
  product.material = req.body.material;
  product.materialDescription = req.body.materialDescription;
  product.color = req.body.color;
  product.price = req.body.price;
  product.description = req.body.description;
  product.inStock = req.body.inStock;
  product.imageUrl = result.secure_url;

  product
    .save()
    .then((err) => {
      // no errors, return success message
      req.flash("success", "Product has been added Successfully");
      // redirect to the add product view
      res.redirect("/admin/add-product");
    })
    .catch((err) => {
      req.flash("danger", err.message);
      console.log(err);
      res.redirect("/admin/add-product");
    });
};

exports.addproductpage = (req, res, next) => {
  // fetch the categories to display on the page
  Category.find({}, (err, categories) => {
    if (err) {
      req.flash("Danger", "Unable to load Categories");
    } else {
      res.render("addProduct", { categories });
    }
  });
};

exports.addcategorypage = (req, res, next) => {
  res.render("addCategory", { message: req.flash("success") });
};

exports.addcategory = (req, res, next) => {
  // create new category instance
  const category = new Category();
  // retrieve the Category name from the data sent over from the client
  category.name = req.body.name;
  category.description = req.body.description;
  category.author = req.body.author;

  // save the category name to mongo
  category.save((err) => {
    // handle errors
    if (err) {
      req.flash("danger", err.message);
      res.redirect("/admin/add-category");
    } else {
      // no errors, return success message
      req.flash("success", "Successfully added a category");
      // redirect to the add category view
      return res.redirect("/admin/add-category");
    }
  });
};

exports.registerView = (req, res, next) => {
  res.render("adminReg");
};

exports.adminRegister = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const isAdmin = req.body.isAdmin;

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "email is already registered, Please login");
    res.redirect("/admin/login");
  }

  check("firstName", "First name is required").notEmpty();
  check("lastName", "Last name is required").notEmpty();
  check("email", "email is required").isEmail();
  check("password", "Passsword is required").trim().notEmpty().isLength({ min: 6 });

  let err = validationResult(req.body);

  if (!err.isEmpty()) {
    return res.flash({ err: err });
  } else {
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      isAdmin,
    });
    bcrypt.hash(user.password, 10, (err, hash) => {
      user.password = hash;
      user.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Registration is successfull, Please Login");
          res.redirect("/admin/cPanel");
        }
      });
    });
  }
};

exports.logout = (req, res, next) => {
  req.logout();
  req.flash("success", "You've successfully logged out");
  res.redirect("/login");
};

exports.adminHome = async (req, res, next) => {
  const stats = await User.count({});
  const orders = await Order.count({ orderStatus: "Created || Successful || Approved" });
  const products = await Product.count({});
  res.render("adminHome", { stats, orders, products });
};

exports.products = async (req, res) => {
  const products = await Product.find({}).populate("category");
  res.render("admin-product-view", { products });
};

exports.viewProductEdit = (req, res, next) => {
  Product.findById(req.params.id, function (err, product) {
    if (err) return console.log(err);
    res.render("admin-product-edit", { product });
  });
};


exports.users = (req, res, next) => {
  User.find({}, function (err, users) {
    if (err) return console.log(err);
    res.render("admin-users", { users });
  });
};


exports.productEdit = (req, res, next) => {
  let product = [];
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.inStock = req.body.inStock;

  let query = { _id: req.params.id };

  Product.update(query, product, function (err) {
    // handle errors
    if (err) {
      req.flash("danger", err.message);
      console.log(err);
      res.redirect("/admin/all-products");
    } else {
      // no errors, return success message
      req.flash("Success", "Product has been updated Successfully");
      // redirect to the add category view
      res.redirect("/admin/all-products");
    }
  });
};

exports.product_delete = (req, res, next) => {
  let query = { _id: req.params.id };
  Product.findByIdAndRemove(query, function (err) {
    if (err) {
      res.redirect("/admin/all-products");
      req.flash("Error", err.message);
    }
    req.flash("Deleted successfully!");
    res.redirect("/admin/all-products");
  });
};

exports.viewCategory = (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) {
      req.flash("Danger", "Unable to load Categories");
    } else {
      res.render("admin-category", { categories });
    }
  });
};

exports.viewCategoryEdit = (req, res, next) => {
  Category.findById(req.params.id, function (err, category) {
    if (err) return console.log(err);
    res.render("admin-category-edit", { category });
  });
};

exports.categoryEdit = (req, res, next) => {
  let category = [];
  category.name = req.body.name;
  category.description = req.body.description;

  let query = { _id: req.params.id };
  Category.update(query, category, function (err) {
    // handle errors
    if (err) {
      req.flash("danger", err.message);
      console.log(err);
      res.redirect("/admin/all-categories");
    } else {
      // no errors, return success message
      req.flash("Success", "Category has been updated Successfully");
      // redirect to the add category view
      res.redirect("/admin/all-categories");
    }
  }).catch((err) => {
    req.flash("Danger", "Error updating product, Try again");
  });
};

exports.category_delete = (req, res, next) => {
  let query = { _id: req.params.id };
  Category.findByIdAndRemove(query, function (err) {
    if (err) {
      res.redirect("/admin/all-categories");
      req.flash("Error", err.message);
    }
    req.flash("Deleted successfully!");
    res.redirect("/admin/all-categories");
  });
};

exports.viewUsers = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      req.flash("Danger", "Unable to load Users");
    } else {
      res.render("admin-users", { users });
    }
  });
};

exports.all_Orders = (req, res, next) => {
  Order.find({}, (err, results) => {
    if (err) {
      req.flash("Danger", "Unable to load Orders");
    } else {
      res.render("admin_orders", { results });
    }
  });
};

exports.view_Order = async (req, res, next) => {
  const result = await Order.findById(req.params.id);

  Order.find({ _id: req.params.id }, function (err, orders) {
    let data = [];
    data.length = 0;
    orders.forEach(function (order) {
      const orderProducts = new Cart(order.orderProducts);
      order.item = orderProducts.generateArray();
      data = order.item;
      console.log(data);
    });
    res.render("admin_Order", { result, orders: data });
  });
};

exports.order_update = (req, res) => {
  let order = {};
  order.orderStatus = req.body.status;

  let query = { _id: req.params.id };

  Order.update(query, order, function (err) {
    // handle errors
    if (err) {
      req.flash("danger", err.message);
      console.log(err);
      res.redirect("/admin/orders");
    } else {
      // no errors, return success message
      req.flash("Success", "Order has been updated Successfully");
      // redirect to the add category view
      res.redirect("/admin/orders");
    }
  });
};

exports.order_delete = (req, res, next) => {
  let query = { _id: req.params.id };
  Order.findByIdAndRemove(query, function (err) {
    if (err) {
      res.redirect("/admin/orders");
      req.flash("Error", err.message);
    }
    req.flash("Deleted successfully!");
    res.redirect("/admin/orders");
  });
};
