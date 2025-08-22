const express = require('express');
const router = express.Router();
const productModel = require("../models/productModel");
const cache = require("../utils/cache");

router.get("/products",async function(req,res){

    try{

        const cachedData = cache.get("products");

         if (cachedData) {
            return res.json(cachedData);
            }

        const products = await productModel.find();
        cache.set("products", products);
         res.send(products);
    }catch(err){
        res.status(500).send(err.message);
    }
})

module.exports=router;