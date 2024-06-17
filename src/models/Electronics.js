const mongoose = require("mongoose");

const electronicSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 10,
        required: [true, "Name is required!"],
    },
    type: {
        type: String,
        minLength: 2,
        required: [true, "Type is required!"],
    },
    damages: {
        type: String,
        minLength: 10,
        required: [true, "Damages is required!"],
    },
    image: {
        type: String,
        match: /^https?:\/\//,
        required: [true, "Image is required!"],
    },
    description: {
        type: String,
        minLength: 10,
        maxLength: 200,
        required: [true, "Description is required!"],
    },
    production: {
        type: Number,
        minLength: 1900,
        maxLength: 2023,
        required: [true, "Production is required!"],
    },
    exploitation: {
        type: Number,
        min: 0,
        required: [true, "Exploitation is required"],
    },

    price: {
        type: Number,
        min: 0,
        required: [true, "Price is required!"],
    },

    buyingList: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    }],

    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
});

const Electronic = mongoose.model("Electronic", electronicSchema);
module.exports = Electronic;

