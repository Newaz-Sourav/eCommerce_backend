const jwt = require("jsonwebtoken");
const ownerModel = require("../models/ownerModel");

module.exports = async function (req,res,next)
{
    if(!req.cookies.token)
    {
        res.status(401).send("You have to login first");
    }

    try{

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        const owner = await ownerModel.findOne({email:decoded.email}).select("-password");

        req.owner = owner;

        next();
    }catch(err){
        res.status(501).send("Something went Wrong");
    }
}