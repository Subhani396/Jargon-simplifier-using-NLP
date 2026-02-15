const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');

/**
 * Extract text from PDF file
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<Object>} Extracted text and metadata
 */
async function extractTextFromPDF(buffer) {
    try {
        const data = await pdfParse(buffer);

        return {
            success: true,
            text: data.text,
            metadata: {
                pages: data.numpages,
                info: data.info,
                wordCount: data.text.split(/\s+/).length
            }
        };
    } catch (error) {
        console.error('PDF extraction error:', error.message);
        return {
            success: false,
            error: 'Failed to extract text from PDF: ' + error.message,
            text: null
        };
    }
}

/**
 * Extract text from DOCX file
 * @param {Buffer} buffer - DOCX file buffer
 * @returns {Promise<Object>} Extracted text and metadata
 */
async function extractTextFromDOCX(buffer) {
    try {
        const result = await mammoth.extractRawText({ buffer });

        return {
            success: true,
            text: result.value,
            metadata: {
                wordCount: result.value.split(/\s+/).length,
                messages: result.messages
            }
        };
    } catch (error) {
        console.error('DOCX extraction error:', error.message);
        return {
            success: false,
            error: 'Failed to extract text from DOCX: ' + error.message,
            text: null
        };
    }
}

/**
 * Extract text from image using OCR
 * @param {Buffer} buffer - Image file buffer
 * @returns {Promise<Object>} Extracted text and metadata
 */
async function extractTextFromImage(buffer) {
    try {
        const { data } = await Tesseract.recognize(buffer, 'eng', {
            logger: m => console.log(m)
        });

        return {
            success: true,
            text: data.text,
            metadata: {
                confidence: data.confidence,
                wordCount: data.text.split(/\s+/).length
            }
        };
    } catch (error) {
        console.error('OCR extraction error:', error.message);
        return {
            success: false,
            error: 'Failed to extract text from image: ' + error.message,
            text: null
        };
    }
}

/**
 * Process uploaded file and extract text based on file type
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - File MIME type
 * @param {string} filename - Original filename
 * @returns {Promise<Object>} Extracted text and metadata
 */
async function processFile(buffer, mimetype, filename) {
    try {
        let result;

        // Determine file type and extract accordingly
        if (mimetype === 'application/pdf') {
            result = await extractTextFromPDF(buffer);
        } else if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            filename.endsWith('.docx')
        ) {
            result = await extractTextFromDOCX(buffer);
        } else if (mimetype.startsWith('image/')) {
            result = await extractTextFromImage(buffer);
        } else {
            return {
                success: false,
                error: 'Unsupported file type. Please upload PDF, DOCX, or image files.',
                text: null
            };
        }

        if (!result.success) {
            return result;
        }

        // Validate extracted text
        if (!result.text || result.text.trim().length === 0) {
            return {
                success: false,
                error: 'No text could be extracted from the file. The file may be empty or contain only images.',
                text: null
            };
        }

        return {
            success: true,
            text: result.text,
            metadata: {
                ...result.metadata,
                filename,
                mimetype,
                fileSize: buffer.length
            }
        };
    } catch (error) {
        console.error('File processing error:', error.message);
        return {
            success: false,
            error: 'Failed to process file: ' + error.message,
            text: null
        };
    }
}

/**
 * Validate file before processing
 * @param {Object} file - Multer file object
 * @returns {Object} Validation result
 */
function validateFile(file) {
    const maxSizes = {
        'application/pdf': 10 * 1024 * 1024, // 10MB
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 5 * 1024 * 1024, // 5MB
        'image/jpeg': 5 * 1024 * 1024, // 5MB
        'image/png': 5 * 1024 * 1024, // 5MB
        'image/jpg': 5 * 1024 * 1024 // 5MB
    };

    const allowedTypes = Object.keys(maxSizes);

    if (!allowedTypes.includes(file.mimetype) && !file.mimetype.startsWith('image/')) {
        return {
            valid: false,
            error: 'Invalid file type. Allowed types: PDF, DOCX, JPG, PNG'
        };
    }

    const maxSize = maxSizes[file.mimetype] || 5 * 1024 * 1024;

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
        };
    }

    return { valid: true };
}

module.exports = {
    extractTextFromPDF,
    extractTextFromDOCX,
    extractTextFromImage,
    processFile,
    validateFile
};
