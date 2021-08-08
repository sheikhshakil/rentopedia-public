const router = require("express").Router();

//file upload for ad posting
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//controllers
const {
  registerPostController,
  loginPostController,
} = require("../controller/authController");

const {
  initPostAdController,
  postAdController,
} = require("../controller/postAdController");

const { profileController } = require("../controller/profileController");
const { exploreGetController } = require("../controller/exploreController");
const { showAdDetails } = require("../controller/adDetailsController");
const { bookAdController, deleteAdController, wishlistAdController } = require("../controller/adOptionsController");
const { approveBooking, rejectBooking } = require("../controller/bookingControllers");
const { filterAdsController } = require("../controller/filterAdsController");

//validators
const regValidator = require("../validators/regValidator");
const isAuth = require("../middlewares/isAuth");
const isUnAuth = require("../middlewares/isUnAuth");


router.get("/register", isUnAuth(), (req, res) => {
  res.render("pages/auth.ejs", { title: "Register", action: "register" });
});

router.get("/login", isUnAuth(), (req, res) => {
  const { unAuth } = req.query;
  res.render("pages/auth.ejs", { title: "Login", action: "login", unAuth });
});

router.get("/logout", isAuth(), (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

//getting form data
router.post("/register", isUnAuth(), regValidator, registerPostController);
router.post("/login", isUnAuth(), loginPostController);

//profile part
router.get("/profile", isAuth(), profileController);

//post ad part
router.post("/initPostAd", isAuth(), initPostAdController);
router.post(
  "/postAd",
  isAuth(),
  upload.array("homePhotos", 10),
  postAdController
);

//explore page
router.get("/explore", exploreGetController);

//search ads
router.get('/filterAds', filterAdsController)

router.get("/showAdDetails", showAdDetails);

//ad options routes
router.post("/bookAd", bookAdController);
router.get('/deleteAd', isAuth(), deleteAdController)
router.post('/wishlist', wishlistAdController)


//booking request handler routes
router.post("/approveBooking", isAuth(), approveBooking);
router.post("/rejectBooking", isAuth(), rejectBooking);

router.get("/", (req, res) => {
  res.render("pages/home.ejs");
});

module.exports = router;
