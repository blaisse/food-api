const mongoose = require('mongoose');
const Restaurant = mongoose.model('restaurants');
const Dish = mongoose.model('dishes');
const User = mongoose.model('users');
const Order = mongoose.model('orders');

module.exports = (app, requireAuth) => {

    app.post('/order', requireAuth, async (req, res) => {
        const user = req.user;
        if(user){
            const { dishes, totalPrice } = req.body;
            const date = new Date().getTime();
            //same date in orders - ordered at the same time
            const obj = {};
            dishes.forEach((item) => {
                if(!obj[item.restaurantId]){
                    obj[item.restaurantId] = [];
                }
                obj[item.restaurantId].push(item);

            });
            const orders = [];
            Object.keys(obj).forEach(async (item) => {
                const restaurant = await Restaurant.findById(item);
                const sepatateDishes = obj[item];

                let price = 0;
                obj[item].forEach((p) => {
                    price += p.price;
                });

                const order = new Order({ dishes: sepatateDishes, price, date, user, restaurant });
                orders.push(order);
                user.zamowienia.unshift(order);
                restaurant.zamowienia.unshift(order);

                Promise.all([ order.save(), restaurant.save() ]);
            });

            user.save().then((sUser) => {
                res.send({ orders });
            });
        }
    });

};