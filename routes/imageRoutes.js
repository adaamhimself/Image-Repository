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

// Create - Upload an image to the repository
router.post('/', upload.single("photo"), async (req, res) => {
    var keywordsArr = req.body.keywords.split(',');
    for (var i = 0; i < keywordsArr.length; i++) {
        keywordsArr[i] = keywordsArr[i].trim();
    }
    var filePath = "./public/photos/" + req.file.filename;
    var hash = await getHash(filePath);
    var newImg = await new Image({
        imgLoc: req.file.filename,
        title: req.body.title,
        altText: "Photo of " + req.body.title,
        keywords: keywordsArr,
        hash: hash
    });
    await newImg.save((err) => {
        if (err) {
            res.status(404).json({ message: err })
        } else {
            res.status(201).json({ message: `Image ${req.body.title} has been uploaded` })           
        }
    });
});

// Read - Returns array of images based on page / page count
router.get('/', (req, res) => {
    if (!req.query.page || !req.query.perPage) {
        res.status(400).json({ message: "Query string must include page and perPage"})
    } else {
        Image.find({}).sort({_id: +1}).skip((req.query.page - 1) * +req.query.perPage).limit(+req.query.perPage).exec()
        .then((image) => { 
            // Check for empty status object array
            if (image.length > 0) {
                res.status(200).json({ message: status }) 
            } else {
                res.status(404).json({ message: "None found" })
            }          
        })
        .catch((err) => { res.status(404).json({ message: err }) })  
    }
})

// Read - Returns a single object by id
router.get('/:imageID', (req, res) => {
    Image.findOne({ _id : req.params.imageID}).lean().exec()
    .then((image) => {
        res.status(201).json({ message: image })
    })
    .catch((err) => { res.status(404).json({ message: err}) })
});

// Update - Change keywords or title
router.put('/:imageID', (req, res) => {
    Image.updateOne({_id: req.params.imageID}, { $set: req.body }).lean().exec()
    .then((status) => {
        res.status(201).json({ message: `Image ${req.params.imageID} has been updated` })
    })
    .catch((err) => { res.status(404).json({ message: err }) }) 
});

// Deletes an image 
router.delete('/:id', (req, res) => {
    Image.findOne({_id : req.params.id })
    .exec()
    .then((image) => {
        var filePath = "./public/photos/" + image.imgLoc;
            // delete uploaded image
        try {
            fs.unlinkSync(filePath);
        } catch(err) {
            res.status(404).json({ message: err })
        }
        Image.deleteOne({ _id : req.params.id })
        .exec()
        .then(() => {
            res.status(201).json({ message: `Image ${req.params.id} has been deleted` })
        })
        .catch((err) => {
            res.status(404).json({ message: err })
        });
    })
    .catch((err) => {
        res.status(404).json({ message: err })
    })
});

// Async function to get a hash for an uploaded file
async function getHash(file) {
    const Jimp = require("jimp");
    const readfile = await Jimp.read(file);
    var fileHash = readfile.hash();
    return Promise.resolve(fileHash);
}

module.exports = router;