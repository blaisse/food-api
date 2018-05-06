const mongoose = require('mongoose');
const Dish = mongoose.model('dishes');
const Restaurant = mongoose.model('restaurants');
const User = mongoose.model('users');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    restaurant: { type: Schema.Types.ObjectId, ref: 'restaurant' },
    // dishes: { type: Schema.Types.ObjectId, ref: 'dish' },
    dishes: [],
    totalPrice: Number
});

const orderModel = mongoose.model('orders', OrderSchema);