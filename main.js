require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
// DATABASE CONNECTION

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Database connected"));

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Static dosyalar için middleware
app.use(express.static("uploads"));

app.use(express.static("public"));

app.use(session({
  secret:"my secret key",
  resave: false,
  saveUninitialized: true
}));

app.use((req,res,next)=>{
  res.locals.message=req.session.message;
  delete req.session.message;
  next();
})
// SET TEMPLATE ENGINE
app.set("view engine","ejs");

// ROUTES
app.use("/",require("./routes/routes"));

app.listen(PORT, (req, res) => {
  console.log(`Server ${PORT} portunda çalışıyor.`);
});
