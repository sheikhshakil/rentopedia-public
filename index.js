require("dotenv").config();
const express = require("express");
const router = require("./routes/router");
const setMiddlewares = require("./middlewares/setMiddlewares");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
setMiddlewares(app);

//set routes
app.use("/", router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Rentopedia started");
});
