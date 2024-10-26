//express
const express = require('express')
//module
const router = require('./routers/myRouter')

//Cookie
const cookieParser = require('cookie-parser')

//Session
const session = require('express-session')

const app = express()
const port = 8080;
const path = require('path')

//Use Cookie
app.use(cookieParser())
//Use Session
app.use(session({
    secret: "mysession", // ควรเปลี่ยนเป็นค่าแบบสุ่มในโปรดักชัน
    resave: false,
    saveUninitialized: false
}));


app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')


//Method Post encoded
app.use(express.urlencoded({extended:false}))

app.use(router)

//static file
app.use(express.static(path.join(__dirname,'public')))


  

app.listen(port,()=>{
    console.log(`Server Start Port ${port} \n!Connect to localhost:${port}`);
})

