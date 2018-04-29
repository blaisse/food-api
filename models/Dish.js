const mongoose = require('mongoose');
const { Schema } = mongoose;

const DishSchema = new Schema({
    nazwa: String,
    cena: Number,
    czas: Number,
    img: String,
    rodzaj: String,
    // restauracja: { type: Schema.Types.ObjectId, ref: 'restaurant' },
    komentarze: [{ type: Schema.Types.ObjectId, ref: 'comment' }]
});

const dishModel = mongoose.model('dishes', DishSchema);