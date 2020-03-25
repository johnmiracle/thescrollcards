const Product = require("../models/Products");
const Category = require("../models/Category");
const Order = require("../models/Order");
const passport = require("passport");
const Cart = require("../models/cart");
const axios = require("axios").default;


exports.addCart = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(cart);
    res.redirect("/");
  });
};

exports.addOne = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.increaseByOne(productId);
  req.session.cart = cart;
  res.redirect("/cart");
};

exports.removeOne = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/cart");
};

exports.cart = (req, res, next) => {
  // if cart is empty 
  if (!req.session.cart) {
    return res.render("cart", {
      products: null || {}
    });
    }
    // New Cart Instance
  const cart = new Cart(req.session.cart);

    // render cart and products
  res.render("cart", {
    products: cart.generateArray(),
    tax: cart.tax,
    totalPrice: cart.totalPrice
  });
};

exports.removeCart = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

    // remove cart
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect("/cart");
};

exports.showLogin = (req, res, next) => {
  res.render("login");
};

exports.login = (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("danger", "Username & Password combination doesn't match any of our records");
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout();
  req.session.cart = null;
  req.flash("success", "You've successfully logged out");
  res.redirect("/login");
};

exports.signup = (req, res, next) => {
  res.render("signup");
};

exports.checkout = (req, res, next) => {
  if (!req.session.cart) {
    return res.render("checkout", {
      products: null
    });
  }
  const cart = new Cart(req.session.cart);
  function currencyFormat(num) {
    return "₦" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  res.render("checkout", {
    products: cart.generateArray(),
    totalPrice: currencyFormat(cart.totalPrice)
  });
};

exports.product = (req, res, next) => {
  res.render("product");
};

exports.productId = (req, res, next) => {
  Product.findById(req.params.id, function(err, product) {
    if (err) return console.log(err);
    res.render("product", { product });
  });
};

exports.payStack = (req, res, next) => {
  const cart = new Cart(req.session.cart);
  axios({
    method: "post",
    url: "https://api.paystack.co/transaction/initialize/",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.paystack_secret_key
    },
    data: {
      amount: cart.totalPrice * 100,
      email: req.body.shipEmail,
      first_name: req.body.shipFirstname,
      last_name: req.body.shipLastName,
      cartid: "" + Math.floor(Math.random() * 1000000000 + 1),
      currency: "NGN",
      MobileNumber: req.body.shipPhoneNumber
    }
  })
    .then(response => {
      let reference = response.data.data.reference;
      // new order doc
      const orderDoc = new Order({
        user: req.user,
        orderPaymentId: reference,
        orderPaymentGateway: "PayStack",
        orderTotal: cart.totalPrice,
        orderEmail: req.body.shipEmail,
        orderFirstName: req.body.shipFirstname,
        orderLastName: req.body.shipLastname,
        orderAddress: req.body.shipAddr1,
        orderCountry: req.body.shipCountry,
        orderState: req.body.shipState,
        orderPostcode: req.body.shipPostcode,
        orderPhone: req.body.shipPhoneNumber,
        orderStatus: "",
        orderGatewayResponse: "",
        orderComment: req.body.shipOrderComment,
        orderDate: new Date(),
        orderProducts: req.session.cart
      });

      orderDoc.save(err => {
        if (err) {
          console.info(err.stack);
        } else {
          // handle success
          res.redirect(response.data.data.authorization_url);
          return;
        }
      });
    })
    .catch(function(error) {
      // handle error
      req.flash("Danger", "There was an error processing your payment. You have not been changed and can try again.");
      res.redirect("/checkout");
      console.log(error);
      return;
    });
  return;
};

exports.payment_return = (req, res, next) => {
  const cart = new Cart(req.session.cart);
  const reference = req.query.reference;

  const url = "https://api.paystack.co/transaction/verify/" + reference;

  return axios
    .get(url, {
      headers: {
        Authorization: process.env.paystack_secret_key
      },
      data: {
        reference: reference
      }
    })
    .then(response => {
      let order = [];
      order.orderStatus = response.data.data.gateway_response;
      order.orderGatewayResponse = response.data.data.gateway_response;

      console.log(response.data.data.gateway_response);
      let query = { orderPaymentId: reference };

      Order.update(query, order, function(err) {
        // handle errors
        if (err) {
          req.flash("danger", err.message);
          console.log(err);
          res.redirect("");
        }
        // set cart to empty
        req.session.cart = null;
        res.render("order_successful", { reference });
        return;
      });
    })
    .catch(function(error) {
      // handle error
      req.flash("Danger", "There was an error verifying your payment.");
      res.redirect("/checkout");
      console.log(error);
      return;
    });
};