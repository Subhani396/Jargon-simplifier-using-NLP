const axios = require('axios');

// Audience-specific system prompts - optimized for concise, clear output
const audiencePrompts = {
    Executive: `You are simplifying technical content for C-level executives. 
CRITICAL RULES:
- Maximum 2-3 short sentences (15-25 words each)
- Focus ONLY on: business impact, ROI, strategic value
- NO technical jargon - use business language only
- Start with the bottom line (what it means for the business)
- Format: One focused paragraph, no bullet points
Example: "This modernizes our infrastructure to handle 3x more customers while cutting costs by 20%. Implementation takes 6 weeks with minimal disruption. Expected ROI within 4 months."`,

    Manager: `You are simplifying technical content for project managers and team leads.
CRITICAL RULES:
- Maximum 3-4 concise sentences (20-30 words each)
- Focus on: timeline, resources needed, risks, team impact
- Minimal technical terms - explain any you must use
- Include one practical next step
- Format: One clear paragraph
Example: "We're breaking the system into smaller, independent pieces that teams can update separately. This means faster releases and easier troubleshooting. Requires 2-week setup with DevOps team. Main risk is initial learning curve for developers."`,

    Client: `You are simplifying technical content for non-technical clients.
CRITICAL RULES:
- Maximum 2-3 very simple sentences (12-20 words each)
- Focus ONLY on: what they get, when they get it, why it matters to them
- ZERO technical jargon - use everyday language
- Emphasize benefits and deliverables
- Format: One friendly paragraph
Example: "We're upgrading your system to handle more users smoothly. You'll see faster performance and can grow without slowdowns. Ready in 3 weeks with no downtime."`,

    Intern: `You are simplifying technical content for interns or beginners.
CRITICAL RULES:
- Maximum 4-5 simple sentences (15-25 words each)
- Explain technical terms in plain language
- Use analogies when helpful
- Focus on learning and understanding
- Format: One educational paragraph
Example: "Think of microservices like a restaurant kitchen - each station (desserts, mains, etc.) works independently. If one station has issues, others keep running. This makes the whole system more reliable and easier to fix. We'll use Docker (like standardized containers) to package everything consistently."`
};

/**
 * Simplify text using Perplexity API
 * @param {string} text - Text to simplify
 * @param {string} audience - Target audience (Executive, Manager, Client, Intern)
 * @returns {Promise<Object>} Simplified text and metadata
 */
async function simplifyText(text, audience = 'Manager') {
    try {
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            throw new Error('PERPLEXITY_API_KEY not found in environment variables');
        }

        const systemPrompt = audiencePrompts[audience] || audiencePrompts.Manager;

        const response = await axios.post(
            'https://api.perplexity.ai/chat/completions',
            {
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: `Simplify this technical/business content:\n\n${text}`
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            }
        );

        const simplifiedText = response.data.choices[0].message.content;
        const usage = response.data.usage;
        const citations = response.data.citations || [];

        return {
            success: true,
            simplifiedText,
            metadata: {
                audience,
                model: response.data.model,
                usage: {
                    promptTokens: usage.prompt_tokens,
                    completionTokens: usage.completion_tokens,
                    totalTokens: usage.total_tokens,
                    cost: usage.cost
                },
                citations,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Perplexity API Error:', error.response?.data || error.message);

        return {
            success: false,
            error: error.response?.data?.error?.message || error.message,
            simplifiedText: null,
            metadata: {
                audience,
                timestamp: new Date().toISOString(),
                errorDetails: error.response?.data
            }
        };
    }
}

/**
 * Analyze complexity of text
 * @param {string} originalText - Original technical text
 * @param {string} simplifiedText - Simplified version
 * @returns {Object} Complexity metrics
 */
function analyzeComplexity(originalText, simplifiedText) {
    // Calculate basic metrics
    const originalWords = originalText.split(/\s+/).length;
    const simplifiedWords = simplifiedText.split(/\s+/).length;

    // Technical jargon detection (simple heuristic)
    const technicalTerms = [
        'api', 'database', 'kubernetes', 'docker', 'microservice', 'deployment',
        'architecture', 'authentication', 'encryption', 'scalability', 'optimization',
        'infrastructure', 'pipeline', 'container', 'orchestration', 'synergy',
        'leverage', 'paradigm', 'ecosystem', 'framework', 'middleware'
    ];

    const originalJargonCount = technicalTerms.filter(term =>
        originalText.toLowerCase().includes(term)
    ).length;

    const simplifiedJargonCount = technicalTerms.filter(term =>
        simplifiedText.toLowerCase().includes(term)
    ).length;

    // Calculate complexity scores (0-100)
    const originalComplexity = Math.min(100, (originalJargonCount / originalWords) * 1000 + 50);
    const simplifiedComplexity = Math.min(100, (simplifiedJargonCount / simplifiedWords) * 1000 + 20);

    const reductionPercentage = Math.round(
        ((originalComplexity - simplifiedComplexity) / originalComplexity) * 100
    );

    return {
        original: {
            wordCount: originalWords,
            jargonCount: originalJargonCount,
            complexityScore: Math.round(originalComplexity)
        },
        simplified: {
            wordCount: simplifiedWords,
            jargonCount: simplifiedJargonCount,
            complexityScore: Math.round(simplifiedComplexity)
        },
        reduction: {
            percentage: reductionPercentage,
            wordCountChange: simplifiedWords - originalWords,
            jargonReduction: originalJargonCount - simplifiedJargonCount
        }
    };
}

/**
 * Extract jargons from text and provide explanations
 * @param {string} text - Original text to analyze
 * @param {string} audience - Target audience for explanations
 * @returns {Promise<Object>} Jargons with short and detailed explanations
 */
async function extractJargons(text, audience = 'Manager') {
    try {
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            throw new Error('PERPLEXITY_API_KEY not found in environment variables');
        }

        // First, identify jargons
        const identificationPrompt = `Analyze this text and identify all technical jargons, acronyms, and complex terms that need explanation for a ${audience} audience. Return ONLY a JSON array of the jargon terms found, nothing else. Format: ["term1", "term2", "term3"]

Text: ${text}`;

        const identificationResponse = await axios.post(
            'https://api.perplexity.ai/chat/completions',
            {
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a technical jargon identifier. Return only a JSON array of terms, no other text.'
                    },
                    {
                        role: 'user',
                        content: identificationPrompt
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        let jargonTerms = [];
        try {
            const responseText = identificationResponse.data.choices[0].message.content.trim();
            // Extract JSON array from response
            const jsonMatch = responseText.match(/\[.*\]/s);
            if (jsonMatch) {
                jargonTerms = JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.error('Error parsing jargon terms:', parseError);
            jargonTerms = [];
        }

        // If no jargons found, return empty result
        if (jargonTerms.length === 0) {
            return {
                success: true,
                jargons: [],
                metadata: {
                    audience,
                    timestamp: new Date().toISOString()
                }
            };
        }

        // Get explanations for each jargon
        const jargonsWithExplanations = await Promise.all(
            jargonTerms.slice(0, 10).map(async (term) => { // Limit to 10 jargons
                try {
                    const explanationPrompt = `Explain the term "${term}" in the context of: ${text}

Provide TWO versions:
1. SHORT (1 sentence, 15-20 words): Brief, simple explanation
2. DETAILED (10-15 lines): Comprehensive explanation with context, examples, and why it matters

Format your response EXACTLY as:
SHORT: [one sentence explanation]
DETAILED: [10-15 lines of detailed explanation]`;

                    const explanationResponse = await axios.post(
                        'https://api.perplexity.ai/chat/completions',
                        {
                            model: 'sonar-pro',
                            messages: [
                                {
                                    role: 'system',
                                    content: `You are explaining technical terms to a ${audience} audience. Be clear, concise, and practical.`
                                },
                                {
                                    role: 'user',
                                    content: explanationPrompt
                                }
                            ]
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Content-Type': 'application/json'
                            },
                            timeout: 30000
                        }
                    );

                    const explanation = explanationResponse.data.choices[0].message.content;

                    // Parse SHORT and DETAILED from response
                    const shortMatch = explanation.match(/SHORT:\s*(.+?)(?=\n|DETAILED:|$)/s);
                    const detailedMatch = explanation.match(/DETAILED:\s*(.+?)$/s);

                    return {
                        term,
                        short: shortMatch ? shortMatch[1].trim() : `${term} is a technical concept used in this context.`,
                        detailed: detailedMatch ? detailedMatch[1].trim() : explanation.trim()
                    };
                } catch (error) {
                    console.error(`Error explaining jargon "${term}":`, error.message);
                    return {
                        term,
                        short: `${term} is a technical term used in this context.`,
                        detailed: `${term} is a technical term that requires further explanation. Please refer to technical documentation for more details.`
                    };
                }
            })
        );

        return {
            success: true,
            jargons: jargonsWithExplanations,
            metadata: {
                audience,
                totalJargons: jargonTerms.length,
                explainedJargons: jargonsWithExplanations.length,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('Extract jargons error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.response?.data?.error?.message || error.message,
            jargons: [],
            metadata: {
                audience,
                timestamp: new Date().toISOString()
            }
        };
    }
}

/**
 * Generate complexity reduction reasoning
 * @param {Object} complexity - Complexity analysis object
 * @returns {string} Explanation for why complexity was reduced
 */
function generateComplexityReasoning(complexity) {
    const reductionPercent = complexity.reduction?.percentage || 0;
    const jargonReduction = complexity.reduction?.jargonReduction || 0;
    const wordCountChange = complexity.reduction?.wordCountChange || 0;

    const reasons = [];

    // Jargon reduction reasoning
    if (jargonReduction > 0) {
        reasons.push(`removed ${jargonReduction} technical term${jargonReduction > 1 ? 's' : ''}`);
    }

    // Word count reasoning
    if (wordCountChange < -20) {
        reasons.push(`condensed content by ${Math.abs(wordCountChange)} words`);
    } else if (wordCountChange > 20) {
        reasons.push(`expanded with ${wordCountChange} additional clarifying words`);
    }

    // Sentence structure
    if (complexity.original?.complexityScore > 70) {
        reasons.push('simplified complex sentence structures');
    }

    // General simplification
    if (reductionPercent > 50) {
        reasons.push('converted technical language to plain English');
    }

    if (reasons.length === 0) {
        return `Complexity reduced by ${reductionPercent}% through general simplification and improved readability.`;
    }

    return `Complexity reduced by ${reductionPercent}% by ${reasons.join(', ')}.`;
}

module.exports = {
    simplifyText,
    analyzeComplexity,
    extractJargons,
    generateComplexityReasoning
};
