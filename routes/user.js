const mongoose = require('mongoose');
const passport = require('passport');
const Authentication = require('./../auth');
const passportService = require('./../passport');

// const User = mongoose.model('users');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
    app.get('/komentarzeUser', requireAuth, async (req, res) => {
        res.send(req.user.komentarze);
    });
};
