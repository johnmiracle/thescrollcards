const user = require("../models/User");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login to view this page");
    res.redirect("/login");
  }
};

// Middleware to check for admin access for certain route
const checkAccess = (req, res, next) => {
  // If the user is not an admin and route is restricted, show message and redirect to home
  if (user.isAdmin === false) {
    req.flash("Unauthorised. Please refer to administrator.");
    res.redirect("/");
  } else {
    next();
  }
};

const checkIn = (req, res, next) => {
  // If the user is login already. redirect home
  if (req.isAuthenticated() && req.url == "/login") {
    res.redirect("/");
  }
  if (req.isAuthenticated() && req.url == "/register") {
    res.redirect("/");
  } else {
    next();
  }
};

const checkUser = (req, res, next) => {
  // If the user is an admin and route is restricted, show message and redirect to /admin
  if (user.isAdmin === true) {
    req.flash("Unauthorised. Please refer to administrator.");
    res.redirect("/admin/admin-home");
  } else {
    next();
  }
};

module.exports = {
  isAuthenticated,
  checkAccess,
  checkUser,
  checkIn,
};
