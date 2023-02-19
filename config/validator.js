const { check, validationResult } = require("express-validator");

const userSignUpValidationRules = () => {
  return [
    check("name", "نام کاربری خود را وارد نمایید").not().isEmpty(),
    check("email", "ایمیل خود را وارد نمایید").not().isEmpty().isEmail(),
    check("password", "لطفا پسورد بیشتر از چهار کاراکتر وارد کنید")
      .not()
      .isEmpty()
      .isLength({ min: 4 }),
  ];
};

const userSignInValidationRules = () => {
  return [
    check("email", "ایمیل خود را وارد کنید").not().isEmpty().isEmail(),
    check("password", "پسورد خود را وارد کنید")
      .not()
      .isEmpty()
      .isLength({ min: 4 }),
  ];
};

const userContactUsValidationRules = () => {
  return [
    check("name", "لطفا نام کاربری را وارد کنید").not().isEmpty(),
    check("email", "لطفا ایمیل ادرس را وارد کنید").not().isEmpty().isEmail(),
    check("message", "پیام شما باید بیشتر از ۱۰ کاراکتر باشد")
      .not()
      .isEmpty()
      .isLength({ min: 10 }),
  ];
};

const validateSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/signup");
  }
  next();
};

const validateSignin = (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors)
  if (!errors.isEmpty()) {
    let messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    console.log(messages);
    req.flash("error", messages);
    return res.redirect("/user/signin");
  }
  next();
};

const validateContactUs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    console.log(messages);
    req.flash("error", messages);
    return res.redirect("/pages/contact-us");
  }
  next();
};

module.exports = {
  userSignUpValidationRules,
  userSignInValidationRules,
  userContactUsValidationRules,
  validateSignup,
  validateSignin,
  validateContactUs,
};
