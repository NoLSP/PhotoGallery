const {Schema, model} = require('mongoose')

const schema = new Schema({
    title: {
        type: String,
        required: false,
        default: "photo_" + Math.trunc(Math.random()*100000)
    },
    image: {
        type: String,
        required: true,
        default: "/images/default_image.png"
    },
    description: {
        type: String,
        required: false,
        default: "without description"
    },
    date: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: String,
        required: true
    }
})

module.exports = model('image', schema);