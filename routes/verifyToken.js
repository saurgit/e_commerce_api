const jwt = require("jsonwebtoken")


const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.token;  // getting token from header
    // console.log(authHeader)
    if(authHeader){
        const token = authHeader.split(" ")[1];  //Bearer <token>
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err){
                res.status(403).json("JSON token is invalid");
            }
            req.user=user;
            next();
        });
    }else{
        res.status(401).json("You are not authenticated");
    }
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        // console.log(req.user)
        // console.log(req.params)

        if( req.user?.id === req.params.id || req.user?.isAdmin){
            next()
        }else{
            res.status(403).json("You are not allowed to do that")
        }
    });
};
const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("You are not an admin you have not authority to do that")
        }
    });
};

module.exports={verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin};