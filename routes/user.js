const mongoose = require('mongoose');
const passport = require('passport');
const Authentication = require('./../auth');
const passportService = require('./../passport');

const User = mongoose.model('users');
const Comment = mongoose.model('comments');
const Dish = mongoose.model('dishes');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {

    app.get('/komentarzeUser', async (req, res) => {
        res.send(req.user.komentarze);
    });

    app.post('/komentarz', requireAuth, async (req, res) => {
        // const user = User.findOne({ nazwa: req.user.nazwa });
        const user = req.user;
        if(user){
            const dish = await Dish.findById(req.body.dish);
            if(dish){
                const comment = new Comment({ tresc: req.body.tresc, autor: user });
                dish.komentarze.unshift(comment);
                user.komentarze.push(comment);

                const resp = {};
                resp.autor = user;
                resp.tresc = comment.tresc;
                resp._id = comment._id;
                // resp.comment = comment;

                Promise.all([ comment.save(), dish.save(), user.save() ]).then(() => {
                    res.send(resp);
                });
            }
        }
    });

    app.post('/edycja', requireAuth, async (req, res) => {
        //User and Restaurant have the same editable fields here
        const user = req.user;

        user.nazwa = req.body.nazwa;
        user.adres = req.body.adres;

        user.save().then((savedUser) => {
            res.send({ nazwa: savedUser.nazwa, adres: savedUser.adres });
        });
    });
};
