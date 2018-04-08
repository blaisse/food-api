const mongoose = require('mongoose');
const jwt = require('jwt-simple');

const Restaurant = mongoose.model('restaurants');
const User = mongoose.model('users');

const keys = require('./config/keys');

function encodeToken(user){
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
}

exports.signupRestaurant = async (req, res, next) => {
    console.log('rest', req.body.nazwa);
    console.log('pass', req.body.password);

    const nazwa = req.body.nazwa;
    const adres = req.body.adres;
    const password = req.body.password;

    if(!nazwa || !password) return res.status(422).send({ error: "Puste pola" });

    const restaurant = await Restaurant.findOne({ nazwa });
    if(restaurant){
        return res.status(422).send({ error: "Email zajęty" });
    }
    const newRestaurant = new Restaurant({ nazwa, password, adres });
    newRestaurant.save().then(() => {
        res.json({ token: encodeToken(newRestaurant), nazwa, adres });
    }).catch((e) => {
        res.status(422).send(e);
    });
};

exports.signupUser = async (req, res, next) => {
    console.log('rest', req.body.nazwa);
    console.log('pass', req.body.password);

    const nazwa = req.body.nazwa;
    const password = req.body.password;

    if(!nazwa || !password) return res.status(422).send({ error: "Puste pola" });

    const restaurant = await User.findOne({ nazwa });
    if(restaurant){
        return res.status(422).send({ error: "Email zajęty" });
    }
    const newRestaurant = new User({ nazwa, password });
    newRestaurant.save().then(() => {
        res.json({ token: encodeToken(newRestaurant), nazwa });
    }).catch((e) => {
        res.status(422).send(e);
    });
};

exports.signin = function(req, res, next){
    res.send({ token: encodeToken(req.user), nazwa: req.user.nazwa });
}