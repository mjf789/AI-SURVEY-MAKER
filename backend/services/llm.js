// backend/services/llm.js - Enhanced version
const axios = require('axios');

class EnhancedLLMService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    async buildEnhancedSurveyStructure(surveyData) {
        const { overview, scales, design, flow, customQuestions } = surveyData;
        
        const prompt = this.createEnhancedPrompt(surveyData);
        
        try {
            const response = await axios.post(this.apiUrl, {
                model: 'gpt-4', // Using GPT-4 for better quality
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert in social psychology research design, survey methodology, and experimental psychology. You create professional, academically rigorous surveys.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 4000
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = response.data.choices[0].message.content;
            return this.parseEnhancedResponse(content);
            
        } catch (error) {
            console.error('LLM API Error:', error.response?.data || error.message);
            throw new Error('Failed to process survey structure');
        }
    }

    createEnhancedPrompt(surveyData) {
        const { overview, scales, design, customQuestions } = surveyData;
        
        return `Create a comprehensive social psychology survey based on the following specifications:

STUDY INFORMATION:
Title: ${overview.title}
Description: ${overview.description}
Target Participants: ${overview.participants}
Study Type: ${overview.type}

EXPERIMENTAL DESIGN:
Design Type: ${design.type || 'Not specified'}
Conditions: ${design.conditions ? design.conditions.join(', ') : 'None'}
Randomization: ${design.randomize ? 'Yes' : 'No'}
Counterbalancing: ${design.counterbalance ? 'Yes' : 'No'}

SELECTED SCALES:
${scales && scales.length > 0 ? scales.join('\n') : 'No pre-selected scales'}

CUSTOM QUESTIONS:
${customQuestions || 'None'}

Please generate a complete survey structure with:

1. CONSENT SECTION
- Professional consent form appropriate for ${overview.participants}
- IRB-compliant language
- Clear study description and risks/benefits

2. DEMOGRAPHICS SECTION
- Standard demographic questions appropriate for the study
- Include: age, gender, ethnicity, education level
- Any demographics specific to ${overview.participants}

3. EXPERIMENTAL MANIPULATION (if applicable)
- Instructions for each condition: ${design.conditions ? design.conditions.join(', ') : 'N/A'}
- Randomization logic
- Manipulation materials or stimuli descriptions

4. MAIN MEASURES
- Include all scales mentioned in SELECTED SCALES
- Ensure proper formatting and response options
- Add instructions for each scale

5. MANIPULATION CHECKS (if experimental)
- Questions to verify participants understood/experienced the manipulation
- Attention check questions

6. ADDITIONAL MEASURES
- Any custom questions specified
- Exploratory measures relevant to the research question

7. DEBRIEF SECTION
- Full explanation of the study
- Contact information
- Resources if applicable

Return the survey in this JSON format:
{
    "title": "Survey title",
    "description": "Brief survey description",
    "blocks": [
        {
            "id": "block_id",
            "name": "Block Name",
            "description": "Block description",
            "randomize": false,
            "questions": [
                {
                    "id": "Q1",
                    "text": "Question text",
                    "type": "MC" | "TE" | "MATRIX" | "SLIDER",
                    "required": true/false,
                    "choices": ["choice1", "choice2"], // for MC
                    "scale": { // for MATRIX
                        "statements": ["statement1", "statement2"],
                        "points": 7,
                        "anchors": ["Strongly Disagree", "Strongly Agree"]
                    },
                    "validation": { // optional
                        "type": "number",
                        "min": 0,
                        "max": 100
                    }
                }
            ]
        }
    ],
    "flow": {
        "randomization": {
            "conditions": ["condition1", "condition2"],
            "type": "random" | "sequential"
        },
        "blocks_order": ["consent", "demographics", "manipulation", "measures", "debrief"]
    },
    "embedded_data": [
        {
            "name": "condition",
            "type": "text"
        }
    ]
}

Ensure all questions are professionally worded and appropriate for academic research.`;
    }

    parseEnhancedResponse(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            
            const parsed = JSON.parse(jsonMatch[0]);
            
            // Validate and enhance the structure
            return this.validateEnhancedStructure(parsed);
            
        } catch (error) {
            console.error('Failed to parse enhanced LLM response:', error);
            throw new Error('Failed to parse survey structure');
        }
    }

    validateEnhancedStructure(structure) {
        // Ensure all required fields exist
        if (!structure.title) {
            structure.title = 'Social Psychology Study';
        }
        
        if (!structure.blocks || !Array.isArray(structure.blocks)) {
            structure.blocks = [];
        }
        
        // Validate each block
        structure.blocks = structure.blocks.map((block, blockIndex) => {
            if (!block.id) block.id = `BL_${blockIndex + 1}`;
            if (!block.name) block.name = `Block ${blockIndex + 1}`;
            if (!block.questions || !Array.isArray(block.questions)) {
                block.questions = [];
            }
            
            // Validate each question in the block
            block.questions = block.questions.map((q, qIndex) => {
                if (!q.id) q.id = `Q${blockIndex + 1}_${qIndex + 1}`;
                if (!q.type) q.type = 'MC';
                if (q.required === undefined) q.required = true;
                
                // Validate question-type specific fields
                if (q.type === 'MC' && (!q.choices || !Array.isArray(q.choices))) {
                    q.choices = ['Option 1', 'Option 2'];
                }
                
                if (q.type === 'MATRIX' && !q.scale) {
                    q.scale = {
                        statements: ['Statement 1'],
                        points: 7,
                        anchors: ['Strongly Disagree', 'Strongly Agree']
                    };
                }
                
                return q;
            });
            
            return block;
        });
        
        // Ensure flow exists
        if (!structure.flow) {
            structure.flow = {
                blocks_order: structure.blocks.map(b => b.id)
            };
        }
        
        return structure;
    }

    async parseWithStructuredPrompt(prompt) {
        try {
            const response = await axios.post(this.apiUrl, {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that extracts structured data from text.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = response.data.choices[0].message.content;
            
            // Parse JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            
            return JSON.parse(jsonMatch[0]);
            
        } catch (error) {
            console.error('LLM parsing error:', error);
            throw error;
        }
    }

    // Keep the original method for backward compatibility
    async parseStudyDescription(description) {
        const prompt = this.createPrompt(description);
        
        try {
            const response = await axios.post(this.apiUrl, {
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert in social psychology research design and survey creation.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const content = response.data.choices[0].message.content;
            return this.parseResponse(content);
            
        } catch (error) {
            console.error('LLM API Error:', error.response?.data || error.message);
            throw new Error('Failed to process study description');
        }
    }

    createPrompt(description) {
        return `Convert the following social psychology study description into a structured survey format.

Study Description:
${description}

Please provide a JSON response with the following structure:
{
    "title": "Survey title",
    "description": "Brief survey description",
    "questions": [
        {
            "id": "Q1",
            "text": "Question text",
            "type": "MC" | "TE" | "MATRIX" | "SLIDER",
            "required": true/false,
            "choices": ["choice1", "choice2"] // for MC questions
            "scale": { // for MATRIX questions
                "min": 1,
                "max": 7,
                "labels": ["Strongly Disagree", "Strongly Agree"]
            }
        }
    ],
    "flow": {
        "randomization": true/false,
        "blocks": ["demographics", "manipulation", "measures"]
    }
}

Guidelines:
1. Include appropriate demographic questions
2. Create proper scales for psychological constructs
3. Add manipulation checks if experimental conditions are mentioned
4. Include attention check questions
5. Use validated scale formats where applicable (e.g., 7-point Likert scales)

Provide ONLY the JSON response, no additional text.`;
    }

    parseResponse(content) {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            
            const parsed = JSON.parse(jsonMatch[0]);
            
            return this.validateSurveyStructure(parsed);
            
        } catch (error) {
            console.error('Failed to parse LLM response:', error);
            return this.getFallbackStructure();
        }
    }

    validateSurveyStructure(structure) {
        if (!structure.title) {
            structure.title = 'Social Psychology Study';
        }
        
        if (!structure.questions || !Array.isArray(structure.questions)) {
            structure.questions = [];
        }
        
        structure.questions = structure.questions.map((q, index) => {
            if (!q.id) q.id = `Q${index + 1}`;
            if (!q.type) q.type = 'MC';
            if (q.required === undefined) q.required = true;
            
            if (q.type === 'MC' && (!q.choices || !Array.isArray(q.choices))) {
                q.choices = ['Option 1', 'Option 2'];
            }
            
            return q;
        });
        
        return structure;
    }

    getFallbackStructure() {
        return {
            title: 'Social Psychology Study',
            description: 'Please complete this survey for our research study.',
            questions: [
                {
                    id: 'Q1',
                    text: 'What is your age?',
                    type: 'TE',
                    required: true
                },
                {
                    id: 'Q2',
                    text: 'What is your gender?',
                    type: 'MC',
                    required: true,
                    choices: ['Male', 'Female', 'Non-binary', 'Prefer not to say']
                }
            ]
        };
    }
}

module.exports = new EnhancedLLMService();