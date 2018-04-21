const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');

const keys = require('./config/keys');
const Restaurant = mongoose.model('restaurants');

const localOptions = { usernameField: 'nazwa' };

const localLogin = new LocalStrategy(localOptions, async function(nazwa, password, done){
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
        return done(null, false, { error: "Błędne dane" });
    }
});

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('auth'),
    secretOrKey: keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, async function(payload, done){
    const user = await Restaurant.findById(payload.sub);
    if(user){
        done(null, user);
    } else {
        done(null, false);
    }
});

passport.use(localLogin);
passport.use(jwtLogin);

