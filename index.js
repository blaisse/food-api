const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

require('./models/Restaurant');
require('./models/User');
require('./models/Comment');
require('./models/Dish');
require('./models/Order');

const keys = require('./config/keys');
const port = process.env.PORT || 3006;
mongoose.connect(keys.mongo);


const Authentication = require('./auth');
const passportService = require('./passport');
const requireAuth = passport.authenticate('jwt', { session: false });

const app = express();
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'auth, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

require('./routes/auth')(app);
require('./routes/restaurant')(app, requireAuth);
require('./routes/user')(app);
require('./routes/order')(app, requireAuth);

// app.get();

app.listen(port, () => {
    console.log('food api running');
});
