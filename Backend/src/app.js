const express = require('express');
const postModel = require('./models/post.model');
const multer = require('multer');
const uploadFile = require('./services/storage.service');
const cors = require('cors');
const { simplifyText, analyzeComplexity, extractJargons, generateComplexityReasoning } = require('./services/perplexity.service');
const { processFile, validateFile } = require('./services/fileProcessor.service');


const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// Create a new post

app.post('/create-post', upload.single('image'), async (req, res) => {
    const result = await uploadFile(req.file.buffer);
    const post = await postModel.create({
        image: result.url,
        caption: req.body.caption
    })
    res.status(201).json({
        messsage: "Post created successfully",
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

// ============================================
// PERPLEXITY API ENDPOINTS
// ============================================

/**
 * POST /api/simplify
 * Simplify text using Perplexity API
 */
app.post('/api/simplify', async (req, res) => {
    try {
        const { text, audience } = req.body;

        // Validation
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Text is required'
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Text exceeds maximum length of 5000 characters'
            });
        }

        // Call Perplexity API for simplification
        const result = await simplifyText(text, audience || 'Manager');

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

        // Analyze complexity
        const complexity = analyzeComplexity(text, result.simplifiedText);

        // Extract jargons from original text
        const jargonResult = await extractJargons(text, audience || 'Manager');

        // Generate complexity reduction reasoning
        const complexityReasoning = generateComplexityReasoning(complexity);

        res.status(200).json({
            success: true,
            originalText: text,
            simplifiedText: result.simplifiedText,
            complexity,
            complexityReasoning,
            jargons: jargonResult.jargons || [],
            metadata: result.metadata
        });
    } catch (error) {
        console.error('Simplify endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error: ' + error.message
        });
    }
});

/**
 * POST /api/simplify-file
 * Upload and simplify file content
 */
app.post('/api/simplify-file', upload.single('file'), async (req, res) => {
    try {
        const { audience } = req.body;

        // Validation
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Validate file
        const validation = validateFile(req.file);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: validation.error
            });
        }

        // Process file and extract text
        const fileResult = await processFile(
            req.file.buffer,
            req.file.mimetype,
            req.file.originalname
        );

        if (!fileResult.success) {
            return res.status(400).json({
                success: false,
                error: fileResult.error
            });
        }

        const extractedText = fileResult.text;

        // Check text length
        if (extractedText.length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Extracted text exceeds maximum length of 5000 characters. Please upload a smaller file.'
            });
        }

        // Call Perplexity API
        const result = await simplifyText(extractedText, audience || 'Manager');

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error
            });
        }

        // Analyze complexity
        const complexity = analyzeComplexity(extractedText, result.simplifiedText);

        res.status(200).json({
            success: true,
            originalText: extractedText,
            simplifiedText: result.simplifiedText,
            complexity,
            fileMetadata: fileResult.metadata,
            metadata: result.metadata
        });
    } catch (error) {
        console.error('Simplify file endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error: ' + error.message
        });
    }
});

/**
 * POST /api/analyze-complexity
 * Analyze complexity between original and simplified text
 */
app.post('/api/analyze-complexity', async (req, res) => {
    try {
        const { originalText, simplifiedText } = req.body;

        if (!originalText || !simplifiedText) {
            return res.status(400).json({
                success: false,
                error: 'Both originalText and simplifiedText are required'
            });
        }

        const complexity = analyzeComplexity(originalText, simplifiedText);

        res.status(200).json({
            success: true,
            complexity
        });
    } catch (error) {
        console.error('Analyze complexity endpoint error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error: ' + error.message
        });
    }
});

module.exports = app;