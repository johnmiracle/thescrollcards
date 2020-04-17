module.exports = {
  isAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash("danger", "Please Login to view this page");
      res.redirect("/login");
    }
    return next();
  },
};
