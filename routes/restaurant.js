const mongoose = require('mongoose');
const Restaurant = mongoose.model('restaurants');

module.exports = (app) => {

    app.get('/restauracje', async (req, res) => {
        const restaurants = await Restaurant.find({});
        res.send(restaurants);
    });

    app.get('/restauracja/:id', async (req, res) => {
        const restauracja = await Restaurant.findOne({ _id: req.params.id });
        if(restauracja){
            return res.send(restauracja);
        }
        res.status(422).send({ error: "Brak restauracji" });
    });

    app.post('/dodajdanie', async (req, res) => {
        const restauracja = await Restaurant.findOne({ _id: req.body.id });
        if(restauracja){
            const rodzaj = req.body.rodzaj;
            const danie = req.body.danie;

            restauracja.menu[rodzaj].push(danie);
            restauracja.save().then(() => {
                res.send(restauracja.menu[rodzaj]);
            });
        } else {
            res.status(422).send({ error: "Nie mozna dodac dania" });
        }
    });

    app.post('/edytujdanie', async (req, res) => {
        const restauracja = await Restaurant.findOne({ _id: req.body.id });
        if(restauracja){
            const rodzaj = req.body.rodzaj;
            const danie = req.body.danie;

            const resztaDan = restauracja.menu[rodzaj].filter((item) => {
                return item.nazwa !== danie.nazwa;
            });

            resztaDan.push(danie);
            restauracja.menu[rodzaj] = resztaDan;
            restauracja.save().then(() => {
                res.send(restauracja);
            });
            // const doEdycji = restauracja.menu[rodzaj].filter((item) => {
            //     return item.nazwa === danie.nazwa;
            // });
            //
            // if(doEdycji.length !== 0){
            //
            // } else {
            //     //maybe just add it if it does not exist
            //     return res.status(422).send({ error: "Nie ma takiego dania" });
            // }

        } else {
            res.status(422).send({ error: "Nie mozna edytowac dania" });
        }
    });
};