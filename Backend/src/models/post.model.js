const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image:String,
    caption:String
});

const postModel = mongoose.model('post', postSchema);  // 'post' is the name of the collection in MongoDB, and postSchema is the schema we defined for that collection.
// and the post name in db as posts automatically pluralizes the name of the collection in MongoDB

module.exports = postModel;