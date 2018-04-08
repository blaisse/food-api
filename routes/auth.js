const Authentication = require('./../auth');
const passport = require('passport');
const passportService = require('./../passport');

const requireSignin = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signupRestaurant', Authentication.signupRestaurant);
    app.post('/signupUser', Authentication.signupUser);
};