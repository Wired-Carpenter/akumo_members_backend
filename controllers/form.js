const express = require("express");
const passport = require("../utils/passport");
const knex = require("../utils/knex");
const moment = require("moment-timezone");

const router = express.Router();

router.get("/check", async (req, res) => {
  const { token } = req.query;
  let expired = false;
  let not_started = false;
  let result = await knex("forms").where({ token }).first();
  console.log(result);
  if (!result) {
    res.json({ not_started: false, expired: false, result: null });
    return;
  }
  console.log(moment(result.end_date).tz("Asia/Ulaanbaatar"));
  console.log(moment.utc());
  const endDateDiff = moment().diff(moment(result.end_date));
  console.log(endDateDiff);
  if (endDateDiff > 0) {
    expired = true;
    result = null;
  }
  if (result) {
    const startDateDiff = moment().diff(moment(result.start_date));
    if (startDateDiff < 0) {
      not_started = true;
      result = null;
    }
  }

  res.json({ not_started, expired, result });
});

router.post("/linux", async (req, res) => {
  const { body } = req;
  const { first_name, last_name, email_address } = body;
  console.log(body);

  const member = await knex("members").where({ email_address }).first();
  if (!member) {
    await knex("members").insert({
      email_address,
      first_name,
      last_name,
      linux: true,
    });
  } else {
    await knex("members").where({ email_address }).update({ linux: true });
  }
  const result = await knex("linux").insert(body);
  res.json(result);
});

router.get("/linux", async (req, res) => {
  const result = await knex("forms").where("type", "linux");
  // console.log(result);
  res.json(result);
});

router.get("/members", async (req, res) => {
  const { formId, type } = req.query;
  const result = await knex({ type }).where("form_id", formId);
  // console.log(result);
  res.json(result);
});

router.post("/members/update", async (req, res) => {
  const { id, type, field, value } = req.body;
  const result = await await knex(type)
    .where("id", id)
    .update({ [field]: value });
  // console.log(result);
  res.json(result);
});

module.exports = router;
