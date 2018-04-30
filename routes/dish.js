const mongoose = require('mongoose');
const Restaurant = mongoose.model('restaurants');
const Dish = mongoose.model('dishes');
const Comment = mongoose .model('comments');

module.exports = (app, requireAuth) => {

    app.get('/dishcomments', (req, res) => {

    });

};