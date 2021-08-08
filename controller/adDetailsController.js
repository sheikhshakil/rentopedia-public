const { db } = require("../configs/firebase");

exports.showAdDetails = (req, res) => {
  const { adId, bookSuccess } = req.query;

  if (adId || bookSuccess) {
    db.collection("houseAds")
      .doc(adId)
      .get()
      .then((doc) => {
        if(doc.exists) {
          const ad = doc.data();
          res.render("pages/adDetails.ejs", {
            title: "Advertisement details",
            ad,
            bookSuccess
          });
        } else {
          res.render("pages/error.ejs", {
            title: "Error",
            error: "Couldn't find the ad in database! Maybe it's deleted by the owner.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.render("pages/error.ejs", {
      title: "Error",
      error: "Unusual entry on this page!",
    });
  }
};
