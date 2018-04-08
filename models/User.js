const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const userSchema = new Schema({
    nazwa: { type: String, unique: true },
    password: String,
    komentarze: { type: Array }
});

userSchema.pre('save', function(next){
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

userSchema.methods.comparePasswords = function(inputPassword, callback){
    bcrypt.compare(inputPassword, this.password, function(err, isMatch){
        if(err){
            // console.log('err?');
            return callback(err);//+r
        }
        // console.log('matching?', isMatch);//FALSE?
        callback(null, isMatch);
    });
}

const modelClass = mongoose.model('users', userSchema);