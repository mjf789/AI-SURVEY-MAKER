// backend/services/llm.js
const axios = require('axios');

class LLMService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

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
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            
            const parsed = JSON.parse(jsonMatch[0]);
            
            // Validate and clean the structure
            return this.validateSurveyStructure(parsed);
            
        } catch (error) {
            console.error('Failed to parse LLM response:', error);
            // Return a basic fallback structure
            return this.getFallbackStructure();
        }
    }

    validateSurveyStructure(structure) {
        // Ensure required fields exist
        if (!structure.title) {
            structure.title = 'Social Psychology Study';
        }
        
        if (!structure.questions || !Array.isArray(structure.questions)) {
            structure.questions = [];
        }
        
        // Validate each question
        structure.questions = structure.questions.map((q, index) => {
            if (!q.id) q.id = `Q${index + 1}`;
            if (!q.type) q.type = 'MC';
            if (q.required === undefined) q.required = true;
            
            // Ensure MC questions have choices
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
                },
                {
                    id: 'Q3',
                    text: 'Please rate your agreement with the following statement: I feel confident in social situations.',
                    type: 'MC',
                    required: true,
                    choices: [
                        'Strongly Disagree',
                        'Disagree',
                        'Somewhat Disagree',
                        'Neutral',
                        'Somewhat Agree',
                        'Agree',
                        'Strongly Agree'
                    ]
                }
            ]
        };
    }
}

module.exports = new LLMService();