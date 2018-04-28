const mongoose = require('mongoose');
const Restaurant = mongoose.model('restaurants');
const Dish = mongoose.model('dishes');
const Comment = mongoose .model('comments');

module.exports = (app, requireAuth) => {

    app.get('/restauracje2', async (req, res) => {
        const restaurants = await Restaurant.find({});
        res.send(restaurants);
    });

    app.get('/restauracje', async (req, res) => {
        //fetch nazwa and adres, id is sent by default
        const restaurants = await Restaurant.find({}, { nazwa: 1, adres: 1 });
        res.send(restaurants);
    });

    //populate menu
    app.get('/restauracja/:id', async (req, res) => {
        const restauracja = await Restaurant.findOne({ _id: req.params.id }).populate({
            path: "menu",
            populate: {
                path: "komentarze",
                model: "comments",
                populate: {
                    path: "autor",
                    select: ["nazwa"],
                    model: "users"
                }
            }
        });
        if(restauracja){
            let menu = {};
            restauracja.menu.forEach((item, i) => {
                if(menu[item.rodzaj]){
                    menu[item.rodzaj].push(item);
                } else {
                    menu[item.rodzaj] = [];
                    menu[item.rodzaj].push(item);
                }
            });
            // const menuArray = [];
            // menuArray.push(menu);
            // console.log('?', r4);
            // restauracja["obj"] = menu;
            // const r = Object.assign({}, restauracja);
            return res.send(restauracja);
        }
        res.status(422).send({ error: "Brak restauracji" });
    });

    app.post('/dodajdanie', requireAuth, async (req, res) => {
        const restauracja = await Restaurant.findById(req.user.id);
        if(restauracja){

            const { rodzaj, nazwa, cena, czas, img } = req.body;
            const dish = new Dish({ nazwa, cena, czas, img, rodzaj });
            restauracja.menu.push(dish);

            Promise.all([ restauracja.save(), dish.save() ]).then(() => {
                res.send(dish);
            });
            // dish.save().then(() => {
            //     res.send(dish);
            // });
        } else {
            res.status(422).send({ error: "Nie mozna dodac dania" });
        }
    });

    app.post('/dodajdanie2', async (req, res) => {
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