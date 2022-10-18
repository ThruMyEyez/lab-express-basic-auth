"use strict";

const { isLoggedIn } = require("../middleware/secure-routes");

const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/main", (req, res, next) => {
  res.render("user/main");
});

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("user/private");
});

module.exports = router;
