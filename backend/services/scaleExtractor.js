// backend/services/scaleExtractor.js
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;

class ScaleExtractorService {
    constructor() {
        this.llmService = require('./llm');
    }

    async extractScalesFromFile(filePath, fileType) {
        let textContent = '';
        
        try {
            if (fileType === 'pdf') {
                textContent = await this.extractFromPDF(filePath);
            } else if (fileType === 'docx') {
                textContent = await this.extractFromDOCX(filePath);
            } else {
                throw new Error('Unsupported file type');
            }
            
            // Use LLM to identify and extract scales
            const scales = await this.identifyScales(textContent);
            
            return scales;
        } catch (error) {
            console.error('Error extracting scales:', error);
            throw error;
        }
    }
    
    async extractFromPDF(filePath) {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    }
    
    async extractFromDOCX(filePath) {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    }
    
    async identifyScales(textContent) {
        const prompt = `
        Analyze the following academic text and extract any psychological scales, measures, or questionnaires.
        
        For each scale found, provide:
        1. Scale name
        2. Full item text for each question
        3. Response format (e.g., 7-point Likert, Yes/No, etc.)
        4. Any reverse-coded items
        5. Subscales if applicable
        6. Brief description of what it measures
        
        Text to analyze:
        ${textContent}
        
        Return the results in this JSON format:
        {
            "scales": [
                {
                    "name": "Scale Name",
                    "description": "What it measures",
                    "items": [
                        {
                            "text": "Item text",
                            "reverse_coded": false,
                            "subscale": "subscale name if applicable"
                        }
                    ],
                    "response_format": {
                        "type": "likert",
                        "points": 7,
                        "anchors": ["Strongly Disagree", "Strongly Agree"]
                    }
                }
            ]
        }`;
        
        return await this.llmService.parseWithStructuredPrompt(prompt);
    }
    
    async validateExtractedScales(scales) {
        // Validate that scales have required fields
        const validatedScales = [];
        
        for (const scale of scales) {
            if (scale.name && scale.items && scale.items.length > 0) {
                // Ensure each item has required fields
                const validatedItems = scale.items.filter(item => 
                    item.text && item.text.trim().length > 0
                );
                
                if (validatedItems.length > 0) {
                    validatedScales.push({
                        ...scale,
                        items: validatedItems
                    });
                }
            }
        }
        
        return validatedScales;
    }
}

module.exports = new ScaleExtractorService();