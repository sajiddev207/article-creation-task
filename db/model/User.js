const mongoose = require("mongoose"),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
const { Schema } = mongoose;

const UserSchema = new Schema({

    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    age: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Number,
        default: Date.now()
    }

})
UserSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
UserSchema.options.toJSON = {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
    }
};
module.exports = mongoose.model('User', UserSchema, 'User')