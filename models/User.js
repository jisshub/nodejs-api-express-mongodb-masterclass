// require mongoose
const mongoose = require('mongoose');
// requre bcryptjs
const bcrypt = require('bcryptjs');
// require jwt
const jwt = require('jsonwebtoken');

// define a UserSchmea
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'please add a name'],
    },
    email: {
        type: String,
        required: [true, 'please add an email'],
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please enter valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'please add password'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// middleware - hash password b4 saving to db - use bcrypt
UserSchema.pre('save', async function (next) {
    // generates salt using genSalt(10) - 10 - no of rounds - higher rounds - more security.
    const salt = await bcrypt.genSalt(10);

    // get password field - use salt to hash it,
    this.password = await bcrypt.hash(this.password, salt);

    // move to next middlare
    next();
});

// sign json web token & return
// methods - define on Document, statics - define on Model
// finally call this method on auth.js controller

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({
            // pertains to currect document / here user, since v use methods here
            id: this._id,
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        }
    );
};


// edxport the schema -
module.exports = mongoose.model('User', UserSchema);