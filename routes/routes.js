const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const multer = require("multer");
const path = require("path");

// ımage upload
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"uploads");
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});

var upload = multer({storage:storage}).single("image");

// insert user
router.post("/add", upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });

        await user.save();  // callback yerine await kullanıyoruz
        
        req.session.message = {
            type: "success",
            message: "Kullanıcı başarıyla eklendi."
        }
        res.redirect("/");
        
    } catch (err) {
        req.session.message = {
            type: "danger",
            message: err.message
        }
        res.redirect("/add");
    }
});

router.get("/", async (req, res) => {
    try {
        const users = await User.find().exec();
        res.render("index", {
            title: "Anasayfa",
            users: users
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/add",(req,res)=>{
    res.render("add",{title:"Kullanıcı Ekle"});
})

module.exports = router;