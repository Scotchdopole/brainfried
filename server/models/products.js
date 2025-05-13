const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name: { type: String, require: false },
    price: { type: Number, require: false },
    image: { type: String, require: false },
    brainrotLevel: { type: Number, require: false },
    desc: { type: String, require: false }
})

module.exports = mongoose.model("products", schema);