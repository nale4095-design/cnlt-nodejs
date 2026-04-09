const BlogPost = require('../models/BlogPost');

exports.index = async (req, res) => {
    const posts = await BlogPost.find({});
    res.render('index', { posts });
};

exports.create = (req, res) => {
    res.render('create');
};

exports.store = async (req, res) => {
    await BlogPost.create(req.body);
    res.redirect('/blogposts');
};

exports.detail = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('detail', { post });
};

exports.edit = async (req, res) => {
    const post = await BlogPost.findById(req.params.id);
    res.render('edit', { post });
};

exports.update = async (req, res) => {
    await BlogPost.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/blogposts');
};

exports.delete = async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/blogposts');
};