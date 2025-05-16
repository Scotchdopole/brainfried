const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name: { type: String, require: false },
    price: { type: Number, require: false },
    image: { type: String, require: false },
    brainrotLevel: { type: Number, require: false },
    desc: { type: String, require: false },
    collection: { type: String, enum: ["Lidl", "Italian", "Ye", "Chinesse"], require: false },
    isNew: { type: Boolean, require: false }
}, { timestamps: true })

module.exports = mongoose.model("products", schema);