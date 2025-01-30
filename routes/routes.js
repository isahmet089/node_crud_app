const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("index",{title:"Anasayfa"});
});

router.get("/add",(req,res)=>{
    res.render("add",{title:"Kullanıcı Ekle"});
})

module.exports = router;