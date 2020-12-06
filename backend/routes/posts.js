const express = require('express')
const router = express.Router();
const multer = require('multer');

const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = new Error('Invalid file type');
    if(isValid) {
      error = null;
    }
    callBack(error, 'backend/images')
  },
  filename: (req, file, callBack) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callBack(null, name + Date.now() + '.' + extension)
  }
})

router.post('', multer({storage: storage}).single('image'), (req, res, next) => { //multer will look for a single file inside an 'image' property in the req body
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      postId: createdPost._id,
      message: 'Post added successfully'
    });
  })
});

router.get('', (req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    })
    .catch(() => {
      console.log('something went wrong')
    })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' })
    }
  })
})

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Update successful!'})
  })
})

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log(result)
      res.status(200).json({ message: 'Post deleted!' })
    })
})

module.exports = router;