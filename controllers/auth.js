const express = require("express");
const passport = require("../utils/passport");

const router = express.Router();

router.post("/login", passport.authenticate("local"), async (req, res) => {
  console.log(req.session.passport);
  res.json({ success: true });
});

router.get("/check", async (req, res) => {
  res.json({ success: !!req?.session?.passport?.user });
});

module.exports = router;
