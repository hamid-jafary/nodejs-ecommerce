const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (user) {
          return done(null, false, { message: "ایمیل وجود دارد" });
        }
        if (password != req.body.password2) {
          return done(null, false, { message: "پسورد باید یکی باشد" });
        }
        const newUser = await new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.username = req.body.name;
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "کاربر وجود ندارد" });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: "پسورد اشتباه است" });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);
