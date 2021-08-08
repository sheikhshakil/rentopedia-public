const { db, storageBucketRoot } = require("../configs/firebase");

module.exports = async (res, userEmail, adId, ...arrayOfFiles) => {
  let fileUrls = [];
  let destination = `${userEmail}/${adId}/`;

  console.log(arrayOfFiles)

  arrayOfFiles.forEach(async (image) => {
    let file = storageBucketRoot.file(destination + image.originalname);

    try {
      await file.save(image.buffer, { contentType: image.mimetype })
      console.log(`${image.originalname} uploaded`);
    } catch (error) {
        console.log(error);
        res.render("pages/error.ejs", {error : "Sorry, some error occured during uploading files!"})
    }
    console.log(file.publicUrl())

    fileUrls.push(file.publicUrl());
  });

  return fileUrls;
};
