const { db } = require("../configs/firebase");
const { validationResult } = require("express-validator");
const formatter = require("../api/validationFormatter");

exports.registerPostController = (req, res) => {
  const { userType, fullName, email, password, gender } = req.body;
  let errors = validationResult(req).formatWith(formatter);

  if (!errors.isEmpty()) {
    errors = errors.mapped();
    console.log(gender);
    return res.render("pages/auth.ejs", {
      title: "Register",
      action: "register",
      errors,
      values: {
        fullName,
        email,
        password,
      },
    });
  } else {
    let userData = {}
    if (userType == 'seeker') {
      userData = {
        userType,
        fullName,
        email,
        password,
        gender,
        bookedAds : []
      };
    } else {
      userData = {
        userType,
        fullName,
        email,
        password,
        gender,
      };
    }

    db.collection("users")
      .doc(email)
      .set(userData)
      .then(() => {
        res.redirect("/profile");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

exports.loginPostController = (req, res) => {
  const { userType, email, password } = req.body;
  db.collection("users")
    .doc(email)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let userData = doc.data();
        if (password == userData.password && userType == userData.userType) {
          req.session.isLoggedIn = true;
          req.session.user = userData;
          if (req.session.favAdId && req.session.user.userType == 'seeker') {
            res.redirect(`/showAdDetails?adId=${req.session.favAdId}`);
          } else {
            res.redirect("/profile");
          }

        } else {
          res.render("pages/auth.ejs", {
            title: "Login",
            action: "login",
            error: "wrong Credentials",
          });
        }
      } else {
        res.render("pages/auth.ejs", {
          title: "Login",
          action: "login",
          error: "no user found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
