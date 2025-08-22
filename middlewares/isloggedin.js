const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports = async function (req,res,next)
{
    if(!req.cookies.token)
    {
        res.status(501).send("You have to login first");
    }

    try{

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        const user = await userModel.findOne({email:decoded.email}).select("-password");

        req.user = user;

        next();
    }catch(err){
        res.status(501).send("Something went Wrong");
    }
}