const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");




// REGISTER
router.post("/register", async (req, res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password1, process.env.PASS_SEC).toString(),
        fullname:req.body.fullname,
        img:req.body.profImage,
    });
    // save the user to the database
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
        //console.log(savedUser);
    } catch (err) {
        res.status(500).json(err)
        //console.log(err);
    }
});

// LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) { res.status(401).json('No user found') }

        const validPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8);
        if (validPassword !== req.body.password) {
            res.status(401).json("Wrong Password")
        }

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );


        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken })
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router