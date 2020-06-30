const mongoose = require("mongoose");
const Bootcamp = require("./Bootcamp");

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

// find average of all ratings in a bootcamp.
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
            // match the bootcamp field in Reiview model with bootcampId
            {
                $match: {
                    bootcamp: bootcampId
                }
            },
            // group the id and averageRating
            {
                $group: {
                    _id: '$bootcamp',
                    averageRating: {
                        $avg: '$rating'
                    }
                }
            }
        ]
        // we gets an array of one object with bootcamp id and averageRating.
    );
    // save to db,
    try {
        // find bootcamp and update it by adding averageRating field
        this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (error) {
        console.log(error);
    }

    console.log(obj); // obj is an array of single object
}

// call static method after saving to db & before removing from db
ReviewSchema.post("save", function () {
    // 
    this.constructor.getAverageRating(this.bootcamp)
})

ReviewSchema.pre("remove", function () {
    this.constructor.getAverageRating(this.bootcamp)
})

// export the schema
module.exports = mongoose.model("Review", ReviewSchema)