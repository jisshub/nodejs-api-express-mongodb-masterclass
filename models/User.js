// require mongoose
const mongoose = require("mongoose");

// define a UserSchmea
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "please add a name"]
    },
    email: {
        type: String,
        required: [true, "please add an email"],
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please enter valid email',
        ],
        unique: true
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'please add password'],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// edxport the schema - 
module.exports = mongoose.Model('User', UserSchema)