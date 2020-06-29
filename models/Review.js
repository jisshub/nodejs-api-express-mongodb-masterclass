const mongoose = require("mongoose");

// define a Schema for review
const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "please add a review title"],
        maxlength: 50
    },
    text: {
        type: String,
        required: [true, "please add some text"],
        maxlength: 500
    },
    rating: {
        type: Number,
        required: [true, "please give a rating b/w 1 and 10"],
        min: 1,
        max: 10
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// export the schema
module.exports = mongoose.model("Review", ReviewSchema)