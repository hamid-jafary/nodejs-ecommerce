const express = require("express");
const csrf = require("csurf");
const nodemailer = require("nodemailer");
const router = express.Router();
const {
  userContactUsValidationRules,
  validateContactUs,
} = require("../config/validator");
const csrfProtection = csrf();
router.use(csrfProtection);

//GET: display abous us page
router.get("/about-us", (req, res) => {
  res.render("pages/about-us", {
    pageName: "درباره ما",
  });
});

//GET: display shipping policy page
router.get("/shipping-policy", (req, res) => {
  res.render("pages/shipping-policy", {
    pageName: "حمل و نقل",
  });
});

//GET: display careers page
router.get("/careers", (req, res) => {
  res.render("pages/careers", {
    pageName: "فرصت های شغلی",
  });
});

//GET: display contact us page and form with csrf tokens
router.get("/contact-us", (req, res) => {
  const successMsg = req.flash("success")[0];
  console.log(successMsg);
  const errorMsg = req.flash("error");
  res.render("pages/contact-us", {
    pageName: "تماس با ما",
    csrfToken: req.csrfToken(),
    successMsg,
    errorMsg,
  });
});

//POST: handle contact us form logic using nodemailer
router.post(
  "/contact-us",
  [userContactUsValidationRules(), validateContactUs],
  (req, res) => {
    // instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        // company's email and password
        user: "6a1630570d61fe",
        pass: "58f3f7071a2f5f",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // email options
    const mailOpts = {
      from: req.body.email,
      to: process.env.GMAIL_EMAIL,
      subject: `از طرف ${req.body.name}`,
      html: `
      <div>
      <h2 style="color: #478ba2; text-align:center;">نام کاربری ${req.body.name}</h2>
      <h3 style="color: #478ba2;">ایمیل : (${req.body.email})<h3>
      </div>
      <h3 style="color: #478ba2;">پیام: </h3>
      <div style="font-size: 30;">
      ${req.body.message}
      </div>
      `,
    };

    // send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
        req.flash(
          "error",
          "ارور رخ داده است لطفا اتصال اینترنت خود را چک کنید"
        );
        return res.redirect("/pages/contact-us");
      } else {
        req.flash("success", "ایمیل با موفقیت ارسال شد.");
        return res.redirect("/pages/contact-us");
      }
    });
  }
);

module.exports = router;
