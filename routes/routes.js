const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

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

router.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    res.render("edit-user", {
        title: "Kullanıcı Düzenle",
        user: user
    });
});

router.post("/edit-user/:id", upload, async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).exec();
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.image = req.file.filename;
    await user.save();
    res.redirect("/");
});

router.get("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await User.findByIdAndDelete(id).exec();
    res.redirect("/");
});


module.exports = router;