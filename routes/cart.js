const Cart=require("../models/Cart")
const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin } = require("./verifyToken")


// CREATE Cart
router.post("/",verifyToken,async (req,res)=>{
    // const newCart = new Cart(req.body)
    try{
        // Try to find the cart document
        console.log(req.body)
        let cart = await Cart.findOne({userId:req.body.userId});
        // console.log(cart)
        
        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart(req.body)
        } else {
            // If cart exists, update the products array
            cart.products.push(req.body.products[0]);
        }

        // Save the cart (whether it's new or existing)
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);


        // const savedCart = await newCart.save();
        // res.status(200).json(savedCart);
    }catch(err){
        // console.log("baigan")
        res.status(401).json(err)
    }
});



//UPDATE CART
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    
//     try {
//         const updatedCart = await Cart.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $push: { products: "$req.body"}
//             },
//             { new: true }
//         );
//         res.status(200).json(updatedCart);
//     } catch (err) {
//         res.status(500).json(err)
//     }
// });


router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        // Try to find the cart document
        // console.log(req.body)
        let cart = await Cart.findById(req.params.id);
        
        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({
                userId: req.params.id,
                products: [req.body] // Assuming req.body contains product data
            });
        } else {
            // If cart exists, update the products array
            cart.products.push(req.body);
        }

        // Save the cart (whether it's new or existing)
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE CART
router.delete('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Cart.findOneAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    }catch(err){
        res.status(500).json(err);
    }
})

// GET USER CART
router.get('/find/:id',verifyTokenAndAuthorization ,async (req,res)=>{
    try{
        const cart = await Cart.find({userId:req.params.id})
        .populate({path:"products",
            populate:{
                path:"productId",
            }
        })

        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err);
    }
})

//GET ALL CART

router.get("/",verifyTokenAndAdmin,async (req,res)=>{
    try{
        const  carts=await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        res.status(500).json(err);
    }
})



module.exports = router