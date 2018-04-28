const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const keys = require('./config/keys');
const Restaurant = mongoose.model('restaurants');
const User = mongoose.model('users');

const localOptions = { usernameField: 'nazwa', passReqToCallback: true };

const localLogin = new LocalStrategy(localOptions, async function(req, nazwa, password, done){
    console.log('type', req.body.type);
    const restaurant = await Restaurant.findOne({ nazwa });
    if(restaurant){
        restaurant.comparePasswords(password, function(err, isMatch){
            if(err){
                return done(err);
            }
            if(!isMatch){
                return done(null, false);
            }
            return done(null, restaurant);
        });
    } else {
        return done(null, false);
    }
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('auth'),
    secretOrKey: keys.secret,
    passReqToCallback: true
};

//Different approach: add type to user and restaurant schema?
//req.body - not for GET
const jwtLogin = new JwtStrategy(jwtOptions, async function(req, payload, done){
    let account;
    if(req.body.type === 'user'){
        account = await User.findById(payload.sub);
    } else {
        account = await Restaurant.findById(payload.sub);
    }
    // const user = await Restaurant.findById(payload.sub);
    if(account){
        done(null, account);
    } else {
        done(null, false);
    }
});

passport.use(localLogin);
passport.use(jwtLogin);

