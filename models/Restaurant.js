const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const restaurantSchema = new Schema({
    nazwa: { type: String, unique: true },
    password: String,
    adres: String,
    opis: String,
    menu: [{ type: Schema.Types.ObjectId, ref: 'dishes' }],
    zamowienia: [{ type: Schema.Types.ObjectId, ref: 'orders' }],
    ocena: Number,
    img: { type: String, default: "http://www.macq01.com.au/d/macq/media/Eat_and_Drink/__thumbs_603_363_crop/Landscape_Restaurant__Grill_8f0622.jpg?1487681215" }
    //komentarze: { type: Array }
});

restaurantSchema.pre('save', function(next){
    //check whether it's a new user or .save() - it would call .pre() again
    //and change hash

    //Find by id - it doesn't change - if there is such a user don't rehash password
    modelClass.findById(this.id).then((found) => {
        if(found){
            next();
        } else {

            modelClass.findOne({ nazwa: this.nazwa }).then((found) => {
                if(!found){
                    const user = this;
                    bcrypt.genSalt(10, function(err, salt){
                        if(err) return next(err);
                        bcrypt.hash(user.password, salt, null, function(err, hash){
                            if(err) return next(err);
                            user.password = hash;
                            next();
                        });
                    });
                } else {
                    next();
                }
            });

        }
    });

});

restaurantSchema.methods.comparePasswords = function(inputPassword, callback){
    bcrypt.compare(inputPassword, this.password, function(err, isMatch){
        if(err){
            // console.log('err?');
            return callback(err);//+r
        }
        // console.log('matching?', isMatch);//FALSE?
        callback(null, isMatch);
    });
}

const modelClass = mongoose.model('restaurants', restaurantSchema);