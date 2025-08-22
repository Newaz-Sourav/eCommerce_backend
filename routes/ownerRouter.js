const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const ownerModel = require("../models/ownerModel");
const bcrypt=require("bcrypt");
const {generateToken} = require("../utils/generateToken")

router.post("/create", async function(req,res)
{

    try{

        let owners = await ownerModel.find();

    if(owners.length>0)
    {
        return res.status(503).send("You Dont have Permissions");
    }

    
   let {fullname,email,password}=req.body;

  

    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, async function(err,hash){

            if(err){
                return res.status(501).send("something went wrong");
            }

            let newOwner = await ownerModel.create({

                fullname,
                email,
                password:hash,
            });

            let token = generateToken(newOwner);
            res.cookie("token",token);
            res.status(201).send(newOwner);

        })
    })

   
        
    }
    catch(err){
        res.status(500).send(err.message);
    }
    
    
});

router.post("/login",async function(req,res){

    let {email,password}=req.body;

    let owner = await ownerModel.findOne({email:email});

    if(!owner)
    {
        return res.status(501).send("Invalid email or password");
    }

    bcrypt.compare(password,owner.password, function(err,result){

        if(result){
            let token = generateToken(owner);
            res.cookie('token', token, {
                 httpOnly: true,
                  secure: true,      
                  sameSite: 'None',
                  maxAge: 7 * 24 * 60 * 60 * 1000      
                  });
            res.send("Logged in");
        }

        else{
             return res.status(501).send("Invalid email or password");
        }
    })

})

router.post("/logout", function(req,res)
{
    res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true, 
  });
    res.send("Logged Out");
})



module.exports=router;