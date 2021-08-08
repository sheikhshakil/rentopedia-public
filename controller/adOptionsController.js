const { db } = require("../configs/firebase");
const admin = require("firebase-admin");

exports.bookAdController = async (req, res) => {
  const { adId, seekerName, seekerEmail, seekerCmnt } = req.body;

  if (req.session.user) {
    if (req.session.user.userType == "seeker") {
      let bookedAd = {
        adId,
        status: "pending",
        bookedOn: new Date(),
      };

      const userRef = db.collection("users").doc(req.session.user.email);

      await userRef.update({
        bookedAds: admin.firestore.FieldValue.arrayUnion(bookedAd),
      });

      const newDoc = await userRef.get();
      req.session.user = newDoc.data();

      await db
        .collection("houseAds")
        .doc(adId)
        .update({
          bookings: admin.firestore.FieldValue.arrayUnion({
            seekerName,
            seekerEmail,
            seekerCmnt,
            status: "pending",
            bookedOn: new Date(),
          }),
        });

      res.redirect(`showAdDetails?adId=${adId}&bookSuccess=true`);
    } else {
      res.render("pages/error.ejs", {
        error: "Sorry you are not allowed to perform this action",
        title: "Error",
      });
    }
  } else {
    req.session.favAdId = adId;
    res.render("pages/auth.ejs", {
      title: "Login",
      action: "login",
      error: "login first",
    });
  }
};

exports.deleteAdController = async (req, res) => {
  const { adId } = req.query;

  try {
    if (req.session.user.userType == "owner") {
      const adDoc = await db.collection("houseAds").doc(adId).get();
      if (adDoc.exists) {
        if (adDoc.data().postedBy == req.session.user.email && adDoc.data().status != 'booked') {
          await db.collection("houseAds").doc(adId).delete();
          return res.redirect("/profile?adDeleteSuccess=true");
        }
      }
    }
    
    res.render('pages/error.ejs', {title : 'Unauthorized operation!', error : "You're not permitted to do this action."})
  } catch (error) {
    console.log(error);
  }
};


exports.wishlistAdController = async (req, res) => {
  const {adId, ownerName, division, thana} = req.body

  if(req.session.user) {
    if(req.session.user.userType == 'seeker') {
      let wishlistData = {
        adId,
        ownerName,
        division,
        thana
      }
  
      const userRef = db.collection("users").doc(req.session.user.email);
  
      await userRef.update({
        wishlist: admin.firestore.FieldValue.arrayUnion(wishlistData),
      });

      req.session.user.wishlist.push(wishlistData)
  
      res.redirect(`/showAdDetails?adId=${adId}`)
    }
    else {
      res.render("pages/error.ejs", {
        error: "Sorry you are not allowed to perform this action",
        title: "Error",
      });
    }

  }else {
    req.session.favAdId = adId;
    return res.render("pages/auth.ejs", {
      title: "Login",
      action: "login",
      error: "login first",
    });
  }
}