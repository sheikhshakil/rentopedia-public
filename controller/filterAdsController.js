const { db } = require("../configs/firebase");

exports.filterAdsController = async (req, res) => {
  let { division, seekerType, thana } = req.query;

  if (thana) {
    thana = thana.trim();
  }

  const adRef = db.collection("houseAds");
  let ads = [];

  try {
    if (division && seekerType && thana) {
      const adSnapshot = await adRef
        .where("division", "==", division)
        .where("seekerType", "==", seekerType)
        .where("thana", "==", thana)
        .get();

      adSnapshot.forEach((doc) => {
        ads.push(doc.data());
      });

      if (adSnapshot.empty) {
        return res.render("pages/error.ejs", {
          title: "No results",
          error: "No results found",
        });
      }

      console.log(ads);
      return res.render("pages/filterAds.ejs", {
        title: "Search results",
        ads,
      });
    }
    if (division) {
      const adSnapshot = await adRef.where("division", "==", division).get();

      adSnapshot.forEach((doc) => {
        ads.push(doc.data());
      });

      if (adSnapshot.empty) {
        return res.render("pages/error.ejs", {
          title: "No results",
          error: "No results found",
        });
      }

      console.log(ads);

      return res.render("pages/filterAds.ejs", {
        title: "Search results",
        ads,
      });
    }
    
  } catch (error) {
    console.log(error);
  }

  res.render("pages/error.ejs", {
    title: "No results",
    error: "No results found",
  });
};
