const { db } = require("../configs/firebase");
const uploadFiles = require("./uploadFiles");

exports.initPostAdController = (req, res) => {
  const { seekerType } = req.body;

  res.render("pages/adPost.ejs", { title: "Post Advertisement", seekerType });
};

exports.postAdController = async (req, res, next) => {
  const {
    seekerType,
    division,
    town,
    thana,
    resName,
    adPay,
    monRent,
    conNum,
    conEmail,
    comments,
  } = req.body;

  //only roommate
  if (seekerType == "roommate") {
    const { sBill, iBill, mealCost, roomSize, members } = req.body;

    const houseAdData = {
      postedBy: req.session.user.email,
      ownerName: req.session.user.fullName,
      status: "available",
      seekerType,
      division,
      town,
      thana,
      resName,
      adPay,
      monRent,
      sBill,
      iBill,
      mealCost,
      roomSize,
      members,
      conNum,
      conEmail,
      comments,
      postedOn: new Date(),
      bookings : []
    };

    let saveRef = db.collection("houseAds");

    saveRef
      .add(houseAdData)
      .then((docRef) => {
        docRef.set({id : docRef.id}, {merge: true}).then(() => {
          res.redirect("/profile?adPostSuccess=true");
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //other seekers
  else {
    const {
      wBill,
      gBill,
      parkFee,
      mtnCost,
      area,
      bedroom,
      livingroom,
      bathroom,
      balcony,
    } = req.body;

    const houseAdData = {
      postedBy: req.session.user.email,
      ownerName : req.session.user.fullName,
      status: "available",
      seekerType,
      division,
      town,
      thana,
      resName,
      adPay,
      monRent,
      wBill,
      gBill,
      parkFee,
      mtnCost,
      area,
      bedroom,
      livingroom,
      bathroom,
      balcony,
      conNum,
      conEmail,
      comments,
      postedOn: new Date(),
      bookings: []
    };

    let saveRef = db.collection("houseAds");

    saveRef
      .add(houseAdData)
      .then((docRef) => {
        docRef.set({id : docRef.id}, {merge: true}).then(() => {
          res.redirect("/profile?adPostSuccess=true");
        })
        .catch(err => {
          console.log(err);
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
