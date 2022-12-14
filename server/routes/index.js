var express = require("express");
var router = express.Router();

const { createInflate } = require("../controllers/file.controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.route("/files").post(createInflate);

module.exports = router;
