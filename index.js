const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config();
const userRoute=require('./routes/user')
const authRoute= require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')
const cors=require('cors')
const bodyParser = require("body-parser");

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connection successfull"))
    .catch((err) => {
        console.log(err);
    })

//ENDPOINTS
app.use(cors())
app.use(express.json())
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/products",productRoute)
app.use("/api/carts",cartRoute)
app.use("/api/orders",orderRoute)
app.use("/api/checkout",stripeRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("sun rha hu bhai mai")
})


