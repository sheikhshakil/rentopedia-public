const { db } = require("../configs/firebase");

exports.approveBooking = async (req, res) => {
  const { seekerEmail, adId } = req.body;

  try {
    const userDocRef = db.collection("users").doc(seekerEmail);
    const doc = await userDocRef.get();
    let bookedAds = doc.data().bookedAds;

    //modifying seeker booking data
    bookedAds.forEach((bookedAd, i) => {
      if (bookedAd.adId == adId) {
        bookedAds[i].status = "approved";
      }
    });

    //modifying ad doc bookings data
    const adDocRef = db.collection("houseAds").doc(adId);
    const adDoc = await adDocRef.get();
    let bookings = adDoc.data().bookings;

    bookings.forEach((booking, i) => {
      if (booking.seekerEmail == seekerEmail) {
        bookings[i].status = "approved";
      }
    });

    await adDocRef.set({ bookings, status : "booked" }, { merge: true });

    userDocRef
      .set({ bookedAds }, { merge: true })
      .then(() => {
        res.send("Approved");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

exports.rejectBooking = async (req, res) => {
  const { seekerEmail, adId } = req.body;

  try {
    const userDocRef = db.collection("users").doc(seekerEmail);
    const doc = await userDocRef.get();
    let bookedAds = doc.data().bookedAds;

    //modifying seeker booking data
    bookedAds.forEach((bookedAd, i) => {
      if (bookedAd.adId == adId) {
        bookedAds[i].status = "rejected";
      }
    });

    //modifying ad doc bookings data
    const adDocRef = db.collection("houseAds").doc(adId);
    const adDoc = await adDocRef.get();
    let bookings = adDoc.data().bookings;

    bookings.forEach((booking, i) => {
      if (booking.seekerEmail == seekerEmail) {
        bookings[i].status = "rejected";
      }
    });

    await adDocRef.set({ bookings }, { merge: true });

    userDocRef
      .set({ bookedAds }, { merge: true })
      .then(() => {
        res.send("Rejected");
      })
      .catch((err) => {
        console.log(err);
      });
      
  } catch (error) {
    console.log(error);
  }
}