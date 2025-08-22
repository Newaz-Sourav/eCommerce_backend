const express = require('express');
const router = express.Router();
const upload = require("../config/multer_config");
const productModel = require("../models/productModel");

router.get("/allproducts",async function(req,res){

    try{

        const products = await productModel.find();

        res.status(200).send(products);
        
    }catch(err){
        res.status(500).send(err.message);
    }
});

router.post("/create", upload.single("image"),async function(req,res)
{
    try{
        let {name,price,discount,bgcolor,panelcolor,textcolor,category}=req.body;

    const product = await productModel.create({
        image:req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor,
        category,
    });
    
    res.send("Product Created");
    }catch(err)
    {
        res.send(err.message);
    }
});


router.put("/update/:id", upload.single("image"), async function (req, res) {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor,category } = req.body;
        const productId = req.params.id;

        
        let product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send("Product not found");
        }

    
        if (name) product.name = name;
        if (price) product.price = price;
        if (discount) product.discount = discount;
        if (bgcolor) product.bgcolor = bgcolor;
        if (panelcolor) product.panelcolor = panelcolor;
        if (textcolor) product.textcolor = textcolor;
        if (category) product.category = category;
        
    
        if (req.file) {
            product.image = req.file.buffer;
        }

        await product.save();
        res.send("Product updated successfully");

    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete("/delete/:id", async function (req, res) {
    try {
        const productId = req.params.id;

        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).send("Product not found");
        }

        res.send("Product deleted successfully");

    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports=router;