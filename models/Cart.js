const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    products: [
         {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:{
               type:Number,  
               default :1 
            },
            color:{
                type:String,
                default:""
            },
            size:{
                type:String,
                default:"S"
            }
        },
    ],  
    
},
    { timestamps: true }
)

module.exports=mongoose.model("Cart",CartSchema)