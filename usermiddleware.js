const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{

    let token =req.header("x-token");

    if(!token){
        res.send("token not found");

    }

    let decode=jwt.verify(token,"usersecurity");

    req.user=decode.user;

    next();



}