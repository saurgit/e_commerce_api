const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
  const { products } = req.body;
  // console.log(products)
  const lineItems = products?.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.productId.title,
        images: [product.productId.img]
      },
      unit_amount: product.productId.price * 100
    },
    quantity: product.quantity
  }));
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      custom_text: {
        shipping_address: {
          message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
        },
        submit: {
          message: 'We\'ll email you instructions on how to get started.',
        },
      },
      success_url: `http://localhost:5173/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/cancel",
      consent_collection: {
        terms_of_service: 'required',
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: 'I agree to the [Terms of Service](https://example.com/terms)',
        },
      },
    })
    // console.log(session.id)
    res.status(200).json({ id: session.id })
  } catch (e) { console.log(e) }
});

router.get("/payDetail/:id",async (req,res)=>{
  const session = await stripe.checkout.sessions.retrieve(req.params.id)
  // console.log(session)
  res.status(200).json(session)
})

// old payment method
// router.post("/payment",(req,res)=>{
//   stripe.charges.create(
//     {
//       source:req.body.tokenId,
//       amount:req.body.amount,
//       currency:"inr",
//     },
//     (stripeErr,stripeRes) => {
//       if(stripeErr){
//         res.status(500).json(stripeErr)
//       }else{
//         res.status(200).json(stripeRes)
//       }
//     }
//   )
// })

module.exports = router;