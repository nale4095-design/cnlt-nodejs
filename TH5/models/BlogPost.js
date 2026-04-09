const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    title: String,
    content: String
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);