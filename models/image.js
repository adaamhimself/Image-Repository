const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    "imgLoc" : String,
    "title" : {
        type : String,
        default : "Untitled image"
    },
    "altText" : {
        type : String,
        default : "Untitled image"
    },
    "keywords" : {
        type : [String],
        default : "none" 
    },
    "hash" : String
});

module.exports = mongoose.model('image', imageSchema);