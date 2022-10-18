"use strict";

const bcryptjs = require("bcryptjs");
const session = require("express-session");
const { default: mongoose } = require("mongoose");
const { isLoggedOut } = require("../middleware/secure-routes");
const router = require("express").Router();

const User = require("./../models/User.model");

//* Registration routes:
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.render("auth/signup", { errMessage: "All fields are mandatory!" });
    return;
  }

  bcryptjs.genSalt(10).then(salt => {
    bcryptjs
      .hash(password, salt)
      .then(hashedPW => {
        console.log(hashedPW);
        return User.create({ username, email, hashedPassword: hashedPW });
      })
      .then(() => res.redirect("/"))
      .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(500).render("auth/signup", { errMessage: err.message });
        } else {
          next(err);
        }
      });
  });
});

//* Login routes:
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.render("auth/login", { errMessage: "Username is not registered. Please check spelling" });
      return;
    } else if (bcryptjs.compareSync(password, user.hashedPassword)) {
      // save user in session and redirect to Main page??
      req.session.currentUser = user;
      res.redirect("/");
    } else {
      res.render("auth/login", { errMessage: "Please provide correct password." });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

/*
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errMessage: "Username is not registered. Pls check for spelling",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("auth/login", { errMessage: "please provide correct Password." });
      }
    })
    .catch(err => next(err));
});
*/
