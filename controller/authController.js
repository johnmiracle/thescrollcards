module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("danger", "Please Login to view this page");
      res.redirect("/login");
    }
  },
};
