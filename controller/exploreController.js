const { db } = require("../configs/firebase");

exports.exploreGetController = async (req, res) => {
  try {
    const allAdsSnapshot = await db.collection("houseAds").get();

    if (allAdsSnapshot.empty) {
      res.render("pages/explore.ejs", {
        title: "Explore sweet homes",
        allAds: undefined,
      });
    } else {
      let allAds = [];
      allAdsSnapshot.forEach((doc) => {
        allAds.push(doc.data());
      });
      res.render("pages/explore.ejs", { title: "Explore sweet homes", allAds });
    }
  } catch (error) {
    console.log(error);
  }
};
