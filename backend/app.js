const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://leomcg:cruzer160@cluster0.lqy14.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database')
  })
  .catch(() => {
    console.log('Connection failed')
  })
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  
  next()
});

app.post('/api/posts', (req, res, next) => {
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

app.get('/api/posts', (req, res, next) => {
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

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log(result)
      res.status(200).json({ message: 'Post deleted!' })
    })
})


module.exports = app;