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
    console.log('type', req.body.type);

    const nazwa = req.body.nazwa;
    const adres = req.body.adres;
    const password = req.body.password;
    const type = req.body.type;

    if(!nazwa || !password) return res.status(422).send({ error: "Puste pola" });

    let account;

    if(type === 'restaurant'){
        account = await Restaurant.findOne({ nazwa });
    } else if(type === 'user'){
        account = await User.findOne({ nazwa });
    }
    if(account){
        return res.status(422).send({ error: "Nazwa jest zajęta" });
    }
    let newAccount;
    if(type === 'restaurant'){
        newAccount = new Restaurant({ nazwa, password, adres });
    } else if(type === 'user'){
        newAccount = new User({ nazwa, password, adres });
    }
    newAccount.save().then(() => {
        res.json({ token: encodeToken(newAccount), nazwa, adres, img: newAccount.img || "" });
    }).catch((e) => {
        res.status(422).send(e);
    });

};

// exports.signupUser = async (req, res, next) => {
//     console.log('rest', req.body.nazwa);
//     console.log('pass', req.body.password);
//
//     const nazwa = req.body.nazwa;
//     const password = req.body.password;
//
//     if(!nazwa || !password) return res.status(422).send({ error: "Puste pola" });
//
//     const restaurant = await User.findOne({ nazwa });
//     if(restaurant){
//         return res.status(422).send({ error: "Email zajęty" });
//     }
//     const newRestaurant = new User({ nazwa, password });
//     newRestaurant.save().then(() => {
//         res.json({ token: encodeToken(newRestaurant), nazwa });
//     }).catch((e) => {
//         res.status(422).send(e);
//     });
// };

exports.signin = function(req, res, next){
    console.log('login', req.user.img);
    res.send({ token: encodeToken(req.user), nazwa: req.user.nazwa, adres: req.user.adres, img: req.user.img || "" });
}