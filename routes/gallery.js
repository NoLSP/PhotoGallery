const {Router} = require('express');
const Image = require('../models/image');
const User = require('../models/user');
const multer  = require('multer');
const router = Router();
const path = require("path");

const pathDataUploads = 'data/uploads/';
var storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './public/' + pathDataUploads); },
    filename: (req, file, cb) => { cb(null, Math.random() + path.extname(file.originalname))} 
});
var upload = multer({ 
    storage: storage
});

router.get('/', async (req, res) => {
    const images = await Image.find({})

    var response = [];

    for (const item of images) {
        const authorName = await User.findById(item.owner);
        var image = {
            title: item.title,
            description: item.description,
            image: item.image,
            author: authorName.login
        };
        response.push(image);
    }

    res.render('gallery', {
        title: 'Gallery',
        isGallery: true,
        images: response
    })
})

router.get('/addphoto', ensureAuth, (req, res) => {
    res.render('addphoto', {
        title: 'Add image',
        isAddPhoto: true
    })
})

router.post('/addphoto', upload.single('image'), async (req, res) => {
    const image = new Image({
        title: req.body.title,
        image: pathDataUploads + req.file.filename,
        description: req.body.description,
        owner: req.user._id
    })
    console.log(image.image)
    await image.save();

    res.redirect('/');
})

function ensureAuth(req, res, next) 
{
    if (req.isAuthenticated())
        return next();
    else 
    {
        req.flash('error', 'You need to authorise for this action');
        res.redirect('/signin');
    }
}

module.exports = router;