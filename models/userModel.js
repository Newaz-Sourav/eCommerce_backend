 const mongoose = require('mongoose');

 const userSchema = mongoose.Schema({

    fullname: String,
    email: String,
    password: String,
    cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
      },
      quantity: {
        type: Number,
        default: 1
      },
      price:Number
    }
  ],


    cartTotal: {
    type: Number,
    default: 0
  },
    contact: Number,
    picture: String,
 });

module.exports = mongoose.model("user",userSchema);