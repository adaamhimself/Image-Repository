// Express and Router
var express = require('express')
var router = express.Router()
const Image = require('../models/image');

// Multer
const path = require("path");
const fs = require("fs");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: "./public/photos",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });

// Keyword search: accepts an array of keywords
router.get('/', (req, res) => {
    let keywordStr = req.body.keywords.toString();
    Image.find({ keywords : keywordStr }).lean()
    .exec()
    .then((images) => {
        if (images.length == 0) res.status(404).json(`No matches`)
        else res.status(201).json({ message: images});
    })
    .catch((err) => {
        res.status(404).json({ message: err});
    });
});

// Compares the hash of an uploaded image to hashes in the database
router.post('/', upload.single('photo'), async (req, res) => {
    var filePath = "./public/photos/" + req.file.filename;
    var hash = await getHash(filePath);
    await Image.findOne({hash: hash}).lean()
    .exec()
    .then((image) => {
        res.status(201).json({ message: image });
    })
    .catch((err) => {
        res.status(404).json({ message: err });
    })
    // delete uploaded image
    try {
        fs.unlinkSync(filePath);
    } catch(err) {
        console.error(err);
    }
});

// Async function to get a hash for an uploaded file
async function getHash(file) {
    const Jimp = require("jimp");
    const readfile = await Jimp.read(file);
    var fileHash = readfile.hash();
    return Promise.resolve(fileHash);
}

module.exports = router;