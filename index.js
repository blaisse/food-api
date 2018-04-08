const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('./models/Restaurant');
require('./models/User');

const keys = require('./config/keys');
const port = process.env.PORT || 3006;
mongoose.connect(keys.mongo);

const app = express();
app.use(bodyParser.json());

require('./routes/auth')(app);
require('./routes/restaurant')(app);

app.listen(port, () => {
    console.log('food api running');
});
