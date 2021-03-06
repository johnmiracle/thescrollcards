const Product = require("../models/Products");
const Category = require("../models/Category");
const Order = require("../models/Order");
const passport = require("passport");
const Cart = require("../models/cart");
const axios = require("axios").default;
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mailgun = require("nodemailer-mailgun-transport");
const auth = require("../config/nodemailer");

exports.addCart = (req, res, next) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function (err, product) {
    if (err) {
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
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
      products: null || {},
    });
  }
  // New Cart Instance
  const cart = new Cart(req.session.cart);

  // render cart and products
  res.render("cart", {
    products: cart.generateArray(),
    tax: cart.tax,
    totalPrice: cart.totalPrice,
  });
};

exports.contact = (req, res, next) => {
  res.render("contact_page");
};

exports.contactUs = (req, res, next) => {
  const quoteDetail = `
    You have a Contact Us request.\n\n
    Client Details:\n 
    Name: ${req.body.name}\n
    Email: ${req.body.email}\n
    <u> Message: </u> \n ${req.body.message}\n
  `;

  const nodemailerMailgun = nodemailer.createTransport(mailgun(auth));

  // mail detail
  nodemailerMailgun.sendMail(
    {
      from: "salesontws@gmail.com",
      to: "anajemiracle@gmail.com", // An array if you have multiple recipients.
      subject: "Contact Us Request",
      "h:Reply-To": "salesontws@gmail.com",
      //You can use "text:" to send plain-text content. It's oldschool!
      text: quoteDetail,
    },
    (err, info) => {
      if (err) {
        console.log(`Error: ${err}`);
        req.flash("Danger", "error sending request!!!");
        return res.redirect("/contact");
      } else {
        req.flash("Success", "Request sent!!!");
        return res.redirect("/contact");
      }
    }
  );
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

exports.polishScroll = async (req, res, next) => {
  const products = await Product.find({ name: "Polish Paper Scrolls" }).populate("category");
  res.render("products", { products });
};

exports.velvetScroll = async (req, res, next) => {
  const products = await Product.find({ name: "Velvet Scrolls" }).populate("category");
  res.render("products", { products });
};

exports.smallPolishScroll = async (req, res, next) => {
  const products = await Product.find({
    name: "Polish Paper Scrolls",
    size: "Small",
  }).populate("category");
  res.render("products", { products });
};

exports.mediumPolishScroll = async (req, res, next) => {
  const products = await Product.find({
    name: "Polish Paper Scrolls",
    size: "Medium",
  }).populate("category");
  res.render("products", { products });
};

exports.bigPolishScroll = async (req, res, next) => {
  const products = await Product.find({
    name: "Polish Paper Scrolls",
    size: "Gig",
  }).populate("category");
  res.render("products", { products });
};

exports.smallVelvetScroll = async (req, res, next) => {
  const products = await Product.find({
    name: "Velvet Scrolls",
    size: "Small",
  }).populate("category");
  res.render("products", { products });
};

exports.mediumVelvetScroll = async (req, res, next) => {
  const products = await Product.find({
    name: "Velvet Scrolls",
    size: "Medium",
  }).populate("category");
  res.render("products", { products });
};

exports.bigVelvetScroll = async (req, res, next) => {
  const products = await Product.find({
    name: "Velvet Scrolls",
    size: "Big",
  }).populate("category");
  res.render("products", { products });
};

exports.luxuryScroll = async (req, res, next) => {
  const products = await Product.find({
    name: "Luxury Scrolls",
  }).populate("category");
  res.render("products", { products });
};

exports.login = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    // check if is not a user
    if (!user) {
      req.flash("Danger", "Username & Password combination doesn't match any of our records, Kindly register!!!");
      return res.redirect("/register");
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (user.isAdmin === true) {
        return res.redirect("/admin/admin-home");
      } else {
        return res.redirect("/");
      }
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

exports.memberRegister = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const address = req.body.address;
  const audience = req.body.audience;
  const isAdmin = req.body.isAdmin;

  let user = await User.findOne({ email: req.body.email });

  // check if emai is registered
  if (user) {
    req.flash("danger", "email is already registered, Please login");
    res.redirect("/login");
  }

  // input validation
  body("firstName", "First name is required").notEmpty();
  body("lastName", "Last name is required").notEmpty();
  body("email", "email is required").isEmail();
  body("phone", "Mobile Number is required").notEmpty();
  body("password", "Passsword is required").trim().notEmpty().isLength({ min: 6 });
  body("address", "Address is required").notEmpty();

  let err = validationResult(req.body);

  if (!err.isEmpty()) {
    return res.flash({ err: err });
  } else {
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      audience,
    });
    bcrypt.hash(user.password, 10, (err, hash) => {
      user.password = hash;
      user.save(function (err) {
        if (err) {
          console.log(err);
          req.flash("danger", "Registration not successfull, Please Try Again");
          res.redirect("/register");
        } else {
          req.flash("success", "Registration is successfull, Please Login");
          res.redirect("/login");
        }
      });
    });
  }
};

exports.checkout = (req, res, next) => {
  if (!req.session.cart) {
    return res.render("checkout", {
      products: null,
    });
  }
  const cart = new Cart(req.session.cart);
  function currencyFormat(num) {
    return "₦" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  res.render("checkout", {
    products: cart.generateArray(),
    totalPrice: currencyFormat(cart.totalPrice),
  });
};

exports.getQuote = (req, res, next) => {
  res.render("getprice");
};

exports.quote = (req, res, next) => {
  const quoteDetail = `
    New Items Quote Price\n\n

    Client Details:\n
    Name: ${req.body.name}\n
    Email: ${req.body.email}\n
    Phone Number: ${req.body.phone}\n\n
    Quote Detail \n
    Items to Print: ${req.body.printDetail}\n
    Design (Do you have a ready made design?): ${req.body.designDetail}\n
    Deliver Address: ${req.body.orderDetail}\n
  `;

  const nodemailerMailgun = nodemailer.createTransport(mailgun(auth));

  nodemailerMailgun.sendMail(
    // mail detail
    {
      from: "salesontws@gmail.com",
      to: "anajemiracle@gmail.com", // An array if you have multiple recipients.
      subject: "Price Quote Request",
      "h:Reply-To": "reply2this@company.com",
      //You can use "html:" to send HTML email content. It's magic!
      // html: "<b>Wow Big powerful letters</b>",
      text: quoteDetail,
    },
    (err, info) => {
      if (err) {
        console.log(`Error: ${err}`);
        req.flash("Danger", "Error sending quote request!!!");
        return res.redirect("/price_quote");
      } else {
        req.flash("Success", "Quote request successfully sent!!!");
        return res.redirect("/price_quote");
      }
    }
  );
};

exports.product = (req, res, next) => {
  res.render("product");
};

exports.productId = (req, res, next) => {
  Product.findById(req.params.id, function (err, product) {
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
      Authorization: process.env.paystack_secret_key,
    },
    data: {
      callback_url: process.env.baseUrl + "/payment_return",
      amount: cart.totalPrice * 100,
      email: req.body.shipEmail,
      first_name: req.body.shipFirstname,
      last_name: req.body.shipLastName,
      cartid: "" + Math.floor(Math.random() * 1000000000 + 1),
      currency: "NGN",
      MobileNumber: req.body.shipPhoneNumber,
    },
  })
    .then((response, error) => {
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
        orderProducts: req.session.cart,
      });

      orderDoc.save((err) => {
        if (err) {
          console.info(err.stack);
        } else {
          // handle success
          res.redirect(response.data.data.authorization_url);
          return;
        }
      });
    })
    .catch(function (error) {
      // handle error
      req.flash("Danger", "There was an error processing your payment. You have not been changed and can try again.");
      res.redirect("/checkout");
      console.log(error);
      return;
    });
  return;
};

exports.payment_return = (req, res, next) => {
  // cart
  const cart = new Cart(req.session.cart);

  // Define the reference
  const reference = req.query.reference;

  // Paystack verify Url
  const url = "https://api.paystack.co/transaction/verify/" + reference;

  const paymentStatus = async () => {
    return await axios.get(url, {
      headers: {
        Authorization: process.env.paystack_secret_key,
      },
      data: {
        reference: reference,
      },
    });
  };
  (async (error) => {
    const response = await paymentStatus();
    let transactionStatus = response.data.data.gateway_response;
    if (error) {
      transactionStatus = false;

      if (transactionStatus === "Cancelled") {
        let { transactionStatus } = Cancelled;
      }
    }

    let order = {};
    order.orderStatus = transactionStatus;
    order.orderGatewayResponse = transactionStatus;

    let query = { orderPaymentId: reference };

    Order.update(query, order, function (err) {
      // handle errors
      if (err) {
        console.log(err);
      }
      // set cart to empty
      req.session.cart = null;
      res.render("order_successful", { reference });
      return;
    }).catch(function (error) {
      // handle error
      req.flash("Danger", "There was an error verifying your payment.");
      res.redirect("/checkout");
      console.log(error);
      return;
    });
  })();
};
