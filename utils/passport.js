const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const knex = require("./knex");

passport.use(
  new LocalStrategy({ session: true }, async (email, password, done) => {
    console.log(email, password);
    try {
      const user = await knex("users").where({ email }).first();
      console.log("user", user);
      if (!user) return done(null, false);
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) return done(null, false);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await knex("users").where({ id }).first();
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = passport;
