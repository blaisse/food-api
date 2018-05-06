const mongoose = require('mongoose');
const Restaurant = mongoose.model('restaurants');
const Dish = mongoose.model('dishes');
const User = mongoose.model('users');
const Order = mongoose.model('orders');

module.exports = (app, requireAuth) => {

    app.post('/order', (req, res) => {
        console.log(req.body);
        res.send(req.body);

        const order = new Order(req.body);
        order.save();
    });

};