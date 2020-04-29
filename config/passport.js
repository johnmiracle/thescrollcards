const User = require("../models/User");
const mongoose = require("mongoose");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

module.exports = (passport) => {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "This email is not registered" });
        }

        if (bcrypt.compareSync(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: "The password doesn't match the one on our records",
          });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
