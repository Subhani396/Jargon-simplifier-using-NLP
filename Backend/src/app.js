const express = require('express');
const postModel = require('./models/post.model');
const multer = require('multer');
const uploadFile = require('./services/storage.service');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

const upload =multer({storage:multer.memoryStorage()});

// Create a new post

app.post('/create-post', upload.single('image'), async (req, res) =>{
    const result = await uploadFile(req.file.buffer);
    const post = await postModel.create({
        image:result.url,
        caption:req.body.caption
    })
    res.status(201).json({
        messsage:"Post created successfully",
        post
    });
});

app.get('/get-posts', async (req, res) => {
    try {
        const posts = await postModel.find();
        res.status(200).json({
            message: "Posts retrieved successfully",
            posts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// app.post('/create-post', upload.single('image'), async (req, res) => {
//     try {
//         const { image, caption } = req.body;
//         const newPost = new postModel({ image, caption });
//         await newPost.save();
//         res.status(201).json(newPost);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
//     console.log(req.body);
// });

// app.get('/get-posts', async (req, res) => {
//     try {
//         const posts = await postModel.find();
//         res.status(200).json(posts);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

module.exports = app;