// const path = require('path')
const express = require('express')
const router = express.Router()

//uploadfile
const multer = require('multer')

const storage = multer.diskStorage({
    //ตำแหน่งจัดเก็บไฟล์
    destination:(req,file,cb)=>{
        cb(null,'./public/images/products')
    },
    //ชื่อไฟล์ไม่ซ้ำกัน
    filename:(req,file,cb)=>{
        cb(null,Date.now()+".jpg")
    }
})
//start upload
const upload = multer({
    storage:storage
})
// use Model
const Product = require('../models/products')

router.get("/", async (req, res) => {
    try {
        const doc = await Product.find(); // ใช้ await แทน exec() พร้อม callback
        res.render("index.ejs", { products: doc });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products");
    }
});

router.get("/logout",(req, res) => {
    // res.clearCookie('username')
    // res.clearCookie('password')
    // res.clearCookie('login')

    req.session.destroy((err)=>{
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/manage')
    })
});


router.get("/add-product",(req,res)=>{
    //cookie
    // if(req.cookies.login){
    //     res.render('form.ejs')
    // }else{
    //     res.render('admin.ejs')
    // }

    //session
    if(req.session.login){
        res.render('form.ejs')
    }else{
        res.render('admin.ejs')
    }
})

router.get("/manage",async (req,res)=>{
     //cookie
    // if(req.cookies.login){
    //     try {
    //         const doc = await Product.find(); // ใช้ await แทน exec() พร้อม callback
    //         res.render("manage.ejs", { products: doc });
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).send("Error fetching products");
    //     }
    // }else{
    //     res.render('admin.ejs')
    // }
    //session
     if(req.session.login){
        try {
            const doc = await Product.find(); // ใช้ await แทน exec() พร้อม callback
            res.render("manage.ejs", { products: doc });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error fetching products");
        }
    }else{
        res.render('admin.ejs')
    }
})

router.get("/delete/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/"); // ส่งกลับไปหน้าแรกหลังลบสำเร็จ
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting product");
    }
});

//กดสินค้าสินแล้วแสดงรายละเอียดสินค้า
router.get("/:id",async (req,res)=>{
    try {
        const productId = req.params.id
        const doc = await Product.findOne({_id:productId})
        res.render("product.ejs", { products: doc });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products");
    }
})

//แก้ไข้
router.post("/edit",async (req,res)=>{
    try {
        const edit_id = req.body.edit_id
        const doc = await Product.findOne({_id:edit_id})
        res.render('edit.ejs', { products: doc })
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching products");
    }
})

//Cookie
// router.post("/login",async (req,res)=>{
//         const username = req.body.username
//         const password = req.body.password
//         const timeExpire = 10000 //10ms
//         if(username == "admin" && password == "321321"){
//             res.cookie('username',username,{maxAge:timeExpire})
//             res.cookie('password',password,{maxAge:timeExpire})
//             res.cookie('login',true ,{maxAge:timeExpire})
//             res.redirect('/manage');
//         }else{
//             res.render('404');
//         }
//         console.log(username,password)
// })

//Session
router.post("/login",async (req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const timeExpire = 10000 //10ms
    if(username == "admin" && password == "321321"){
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge=timeExpire
        res.redirect('/manage');
    }else{
        res.render('404');
    }
    console.log(username,password)
})

router.post("/insert",upload.single("image"),async (req, res) => {
    try {
        let data = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.file.filename,
            description: req.body.description
        });

        await Product.saveProduct(data);
        res.redirect('/add-product'); 
    } catch (err) {
        console.error(err); 
        res.status(500).send('Error saving product');
    }
});

router.post("/update",async (req, res) => {
    try {
        const update_id = req.body.update_id
        let data = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        };
        await Product.findByIdAndUpdate(update_id,data)
        res.redirect('/manage'); 
    } catch (err) {
        console.error(err); 
        res.status(500).send('Error saving product');
    }
});

module.exports = router