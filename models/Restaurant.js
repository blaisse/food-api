const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const restaurantSchema = new Schema({
    nazwa: { type: String, unique: true },
    password: String,
    adres: String,
    opis: String,
    menu: {
        dania_glowne: { type: Array },
        zupy: { type: Array },
        makarony: { type: Array },
        desery: { type: Array },
        przystawki: { type: Array },
        salatki: { type: Array }
    },
    ocena: Number,
    komentarze: { type: Array }
});

restaurantSchema.pre('save', function(next){
    //check whether it's a new user or .save() - it would call .pre() again
    //and change hash
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