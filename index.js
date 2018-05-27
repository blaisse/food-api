const http = require('http');
const socketIO = require('socket.io');
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
const server = http.createServer(app);
const io = socketIO(server);
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'auth, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers, Origin, Accept, Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

io.on('connection', (socket) => {
    console.log('socket connected');
    socket.on('join', (id) => {
        console.log('huh?', id);
        socket.join(id);
    });
});

require('./routes/auth')(app);
require('./routes/restaurant')(app, requireAuth);
require('./routes/user')(app);
require('./routes/order')(app, requireAuth, io);

// app.get();

server.listen(port, () => {
    console.log('food api running');
});
