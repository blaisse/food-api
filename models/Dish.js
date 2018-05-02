const mongoose = require('mongoose');
const Comment = mongoose.model('comments');
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

// DishSchema.virtual('srednia').get(function() {
//     dishModel.findById(this.id).populate({ path: "komentarze" }).then((found) => {
//         console.log('found', found);
//     });
//     // console.log('this', this);
//     return "xd";
// });

const dishModel = mongoose.model('dishes', DishSchema);