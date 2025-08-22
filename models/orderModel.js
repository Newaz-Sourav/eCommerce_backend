const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  name: String,
  email: String,
  location: String,
  phone: Number,
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  totalPrice: {  // total price field
    type: Number,
    required: true
  },

  orderDate: {
    type: Date,
    default: Date.now
  },

  order_status: {
    type : String,
    default: "Pending"
  }
});

module.exports = mongoose.model("orders", orderSchema);
