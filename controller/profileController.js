const { db } = require("../configs/firebase");

exports.profileController = async (req, res) => {
  const user = req.session.user;

  if (user.userType == "owner") {
    const { adPostSuccess, adDeleteSuccess } = req.query;
    const adsRef = db.collection("houseAds");

    try {
      const snapshot = await adsRef
        .where("postedBy", "==", req.session.user.email)
        .get();

      if (snapshot.empty) {
        res.render("pages/profile.ejs", {
          title: "Profile",
          postedAds: undefined,
          adPostSuccess,
          adDeleteSuccess
        });
      } else {
        let postedAds = [];

        snapshot.forEach((doc) => {
          postedAds.push(doc.data());
        });

        res.render("pages/profile.ejs", {
          title: "Profile",
          postedAds,
          adPostSuccess,
          adDeleteSuccess
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else if (user.userType == "seeker") {
    let bookedAdsDetails = [];

    for (let i = 0; i < user.bookedAds.length; i++) {
      try {
        let doc = await db
          .collection("houseAds")
          .doc(user.bookedAds[i].adId)
          .get();

        if (doc.exists) {
          bookedAdsDetails.push({
            adData: doc.data(),
            status: user.bookedAds[i].status,
            bookedOn: user.bookedAds[i].bookedOn
          });
        }
        else {
          bookedAdsDetails.push({
            isDeleted : true,
            status : "Ad deleted",
            bookedOn : user.bookedAds[i].bookedOn
          })
        }
      } catch (err) {
        console.log(err);
      }
    }
    res.render("pages/profile.ejs", { title: "Profile", bookedAdsDetails });
  }
};
