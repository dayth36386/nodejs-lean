//use mongoose
const mongoose = require('mongoose')

//connect mongoose mongodb:// host:port /dbname
const dbUrl = 'mongodb://localhost:27017/mydb'
mongoose.connect(dbUrl).catch(err=>console.log(err))

//Desing Schema Field:Type
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})
//Create Model or Collection Mongodb
let Product = mongoose.model("products",productSchema)

//Exports Model
module.exports = Product

//Sava data
module.exports.saveProduct = async (data) => { // ใช้ async/await
    try {
        const product = new Product(data); // สร้างอ็อบเจกต์ใหม่
        await product.save(); // รอการบันทึกข้อมูล
    } catch (err) {
        console.error("Error saving product:", err); // แสดงข้อผิดพลาด
        throw err; // โยนข้อผิดพลาดเพื่อให้ฟังก์ชันเรียกใช้งานจัดการ
    }
};