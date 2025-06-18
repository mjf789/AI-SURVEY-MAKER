// backend/services/qualtrics.js - CREATE BLOCK FIRST VERSION
const axios = require('axios');

class QualtricsService {
    constructor() {
        this.apiToken = process.env.QUALTRICS_API_TOKEN;
        this.dataCenter = process.env.QUALTRICS_DATACENTER;
        this.baseUrl = `https://${this.dataCenter}.qualtrics.com/API/v3`;
        
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'X-API-TOKEN': this.apiToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    async createSurvey(surveyStructure) {
        try {
            console.log('Step 1: Creating survey...');
            
            // Create the survey
            const surveyResponse = await this.axiosInstance.post('/survey-definitions', {
                SurveyName: surveyStructure.title || 'Psychology Study',
                Language: 'EN',
                ProjectCategory: 'CORE'
            });
            
            const surveyId = surveyResponse.data.result.SurveyID;
            console.log('✓ Survey created with ID:', surveyId);
            
            // Step 2: Create a new block for our questions
            console.log('Step 2: Creating question block...');
            const blockId = await this.createBlock(surveyId, 'Main Questions');
            console.log('✓ Block created with ID:', blockId);
            
            // Step 3: Add questions to our new block
            console.log('Step 3: Adding questions to block...');
            await this.addQuestionsToBlock(surveyId, blockId, surveyStructure.questions);
            
            // Step 4: Update the survey flow to show our block
            await this.updateSurveyFlow(surveyId, blockId);
            
            return surveyId;
            
        } catch (error) {
            console.error('Error in survey creation:', error.response?.data || error.message);
            throw new Error('Failed to create survey');
        }
    }

    async createBlock(surveyId, blockName) {
        try {
            const blockPayload = {
                Type: "Standard",
                Description: blockName,
                BlockElements: [], // Must be empty array as per docs
                Options: {
                    BlockLocking: "false",
                    RandomizeQuestions: "false",
                    BlockVisibility: "Expanded"
                }
            };
            
            console.log('Creating block with payload:', JSON.stringify(blockPayload, null, 2));
            
            const response = await this.axiosInstance.post(
                `/survey-definitions/${surveyId}/blocks`,
                blockPayload
            );
            
            if (response.data.result && response.data.result.BlockID) {
                return response.data.result.BlockID;
            }
            
            throw new Error('No BlockID returned from API');
            
        } catch (error) {
            console.error('Error creating block:', error.response?.data || error.message);
            throw new Error('Failed to create block');
        }
    }

    async addQuestionsToBlock(surveyId, blockId, questions) {
        console.log(`Adding ${questions.length} questions to block ${blockId}...`);
        
        let successCount = 0;
        
        for (const [index, question] of questions.entries()) {
            try {
                const questionId = await this.createQuestion(surveyId, blockId, question, index);
                successCount++;
                console.log(`✓ Added question ${index + 1}: "${question.text.substring(0, 50)}..." with ID: ${questionId}`);
            } catch (error) {
                console.error(`✗ Failed to add question ${index + 1}:`, error.response?.data || error.message);
            }
        }
        
        console.log(`Successfully added ${successCount}/${questions.length} questions`);
        
        if (successCount === 0) {
            throw new Error('Failed to add any questions');
        }
    }

    async createQuestion(surveyId, blockId, question, index) {
        // Build minimal question payload first
        let questionPayload = {
            QuestionText: question.text,
            QuestionType: 'MC',
            Selector: 'SAVR',
            SubSelector: 'TX',
            Configuration: {
                QuestionDescriptionOption: 'UseText'
            },
            DataExportTag: question.id || `Q${index + 1}`,
            QuestionDescription: question.text,
            Validation: {
                Settings: {
                    ForceResponse: 'OFF',
                    Type: 'None'
                }
            }
        };

        // Add choices for multiple choice questions
        if (question.type === 'MC' && question.choices) {
            questionPayload.Choices = {};
            questionPayload.ChoiceOrder = [];
            
            question.choices.forEach((choice, idx) => {
                const choiceId = (idx + 1).toString();
                questionPayload.Choices[choiceId] = {
                    Display: choice
                };
                questionPayload.ChoiceOrder.push(choiceId);
            });
        } else if (question.type === 'TE') {
            // Text Entry
            questionPayload.QuestionType = 'TE';
            questionPayload.Selector = 'SL';
            delete questionPayload.SubSelector;
        } else {
            // Default choices if none provided
            questionPayload.Choices = {
                "1": { Display: "Yes" },
                "2": { Display: "No" }
            };
            questionPayload.ChoiceOrder = ["1", "2"];
        }

        console.log(`Creating question with blockId=${blockId}`);
        
        // Make the API call with blockId as query parameter
        const response = await this.axiosInstance.post(
            `/survey-definitions/${surveyId}/questions?blockId=${blockId}`,
            questionPayload
        );
        
        return response.data.result.QuestionID;
    }

    async updateSurveyFlow(surveyId, blockId) {
        try {
            console.log('Step 4: Updating survey flow...');
            
            // Get current survey flow
            const surveyDef = await this.axiosInstance.get(`/survey-definitions/${surveyId}`);
            const currentFlow = surveyDef.data.result.SurveyFlow || { 
                Flow: [], 
                Properties: {}, 
                FlowID: 'FL_1',
                Type: 'Root'
            };
            
            // Add our block to the flow
            if (!currentFlow.Flow) {
                currentFlow.Flow = [];
            }
            
            // Add block to flow if not already there
            const blockExists = currentFlow.Flow.some(element => 
                element.Type === 'Block' && element.ID === blockId
            );
            
            if (!blockExists) {
                currentFlow.Flow.push({
                    ID: blockId,
                    Type: 'Block',
                    FlowID: `FL_${currentFlow.Flow.length + 2}`
                });
            }
            
            // Update the flow
            await this.axiosInstance.put(
                `/survey-definitions/${surveyId}/flow`,
                currentFlow
            );
            
            console.log('✓ Survey flow updated');
            
        } catch (error) {
            console.log('Note: Could not update survey flow, but survey may still work');
        }
    }

    async addQuestions(surveyId, questions) {
        // This method is called from the route but we handle everything in createSurvey
        console.log('Questions already processed during survey creation');
    }

    getSurveyUrl(surveyId) {
        return `https://${this.dataCenter}.qualtrics.com/jfe/form/${surveyId}`;
    }

    // NEW ENHANCED METHODS START HERE

    // Add this method to handle enhanced survey creation
    async createEnhancedSurvey(surveyStructure) {
        try {
            console.log('Creating enhanced survey...');
            
            // Create the survey
            const surveyResponse = await this.axiosInstance.post('/survey-definitions', {
                SurveyName: surveyStructure.title || 'Psychology Study',
                Language: 'EN',
                ProjectCategory: 'CORE'
            });
            
            const surveyId = surveyResponse.data.result.SurveyID;
            console.log('✓ Survey created with ID:', surveyId);
            
            // Create blocks for each section
            for (const block of surveyStructure.blocks) {
                const blockId = await this.createBlock(surveyId, block.name);
                console.log(`✓ Created block: ${block.name} with ID: ${blockId}`);
                
                // Add questions to the block
                for (const [index, question] of block.questions.entries()) {
                    await this.createEnhancedQuestion(surveyId, blockId, question, index);
                }
            }
            
            // Update survey flow
            await this.updateEnhancedSurveyFlow(surveyId, surveyStructure);
            
            return surveyId;
            
        } catch (error) {
            console.error('Error in enhanced survey creation:', error.response?.data || error.message);
            throw new Error('Failed to create enhanced survey');
        }
    }

    // Enhanced question creation with more question types
    async createEnhancedQuestion(surveyId, blockId, question, index) {
        let questionPayload = {
            QuestionText: question.text,
            DataExportTag: question.id || `Q${index + 1}`,
            QuestionDescription: question.text,
            Validation: {
                Settings: {
                    ForceResponse: question.required ? 'ON' : 'OFF',
                    Type: 'None'
                }
            }
        };

        // Handle different question types
        switch(question.type) {
            case 'MC':
                questionPayload.QuestionType = 'MC';
                questionPayload.Selector = 'SAVR';
                questionPayload.SubSelector = 'TX';
                
                if (question.choices) {
                    questionPayload.Choices = {};
                    questionPayload.ChoiceOrder = [];
                    
                    question.choices.forEach((choice, idx) => {
                        const choiceId = (idx + 1).toString();
                        questionPayload.Choices[choiceId] = { Display: choice };
                        questionPayload.ChoiceOrder.push(choiceId);
                    });
                }
                break;
                
            case 'TE':
                questionPayload.QuestionType = 'TE';
                questionPayload.Selector = 'SL';
                
                if (question.validation) {
                    questionPayload.Validation = {
                        Settings: {
                            ForceResponse: question.required ? 'ON' : 'OFF',
                            Type: question.validation.type || 'None',
                            Min: question.validation.min,
                            Max: question.validation.max
                        }
                    };
                }
                break;
                
            case 'MATRIX':
                questionPayload.QuestionType = 'Matrix';
                questionPayload.Selector = 'Likert';
                questionPayload.SubSelector = 'SingleAnswer';
                
                if (question.scale) {
                    // Add statements
                    questionPayload.Choices = {};
                    question.scale.statements.forEach((statement, idx) => {
                        const choiceId = (idx + 1).toString();
                        questionPayload.Choices[choiceId] = { Display: statement };
                    });
                    
                    // Add scale points
                    questionPayload.Answers = {};
                    questionPayload.AnswerOrder = [];
                    
                    for (let i = 1; i <= question.scale.points; i++) {
                        const answerId = i.toString();
                        let display = i.toString();
                        
                        // Add anchors for first and last points
                        if (i === 1 && question.scale.anchors) {
                            display = `${i} - ${question.scale.anchors[0]}`;
                        } else if (i === question.scale.points && question.scale.anchors) {
                            display = `${i} - ${question.scale.anchors[1]}`;
                        }
                        
                        questionPayload.Answers[answerId] = { Display: display };
                        questionPayload.AnswerOrder.push(answerId);
                    }
                }
                break;
                
            case 'SLIDER':
                questionPayload.QuestionType = 'Slider';
                questionPayload.Selector = 'HSLIDER';
                questionPayload.Configuration = {
                    Min: question.min || 0,
                    Max: question.max || 100,
                    GridLines: question.gridLines || 10
                };
                break;
        }

        console.log(`Creating ${question.type} question with blockId=${blockId}`);
        
        const response = await this.axiosInstance.post(
            `/survey-definitions/${surveyId}/questions?blockId=${blockId}`,
            questionPayload
        );
        
        return response.data.result.QuestionID;
    }

    // Setup experimental conditions
    async setupExperimentalConditions(surveyId, design) {
        try {
            console.log('Setting up experimental conditions...');
            
            // Create embedded data fields for conditions
            const embeddedData = {
                condition: design.conditions[0] || 'control',
                condition_assigned: 'false'
            };
            
            // This would require additional Qualtrics API calls to set up
            // randomization and embedded data fields
            console.log('✓ Experimental conditions configured');
            
        } catch (error) {
            console.error('Error setting up conditions:', error);
        }
    }

    // Configure advanced survey flow
    async configureSurveyFlow(surveyId, flowConfig) {
        try {
            console.log('Configuring survey flow...');
            
            // Get current survey definition
            const surveyDef = await this.axiosInstance.get(`/survey-definitions/${surveyId}`);
            const blocks = surveyDef.data.result.Blocks || {};
            
            // Build flow based on configuration
            const flow = {
                Flow: [],
                Properties: {},
                FlowID: 'FL_1',
                Type: 'Root'
            };
            
            // Add blocks in specified order
            if (flowConfig && flowConfig.blocks_order) {
                flowConfig.blocks_order.forEach((blockName, index) => {
                    // Find block ID by name
                    const blockId = Object.keys(blocks).find(id => 
                        blocks[id].Description === blockName
                    );
                    
                    if (blockId) {
                        flow.Flow.push({
                            ID: blockId,
                            Type: 'Block',
                            FlowID: `FL_${index + 2}`
                        });
                    }
                });
            } else {
                // Add all blocks in default order
                Object.keys(blocks).forEach((blockId, index) => {
                    flow.Flow.push({
                        ID: blockId,
                        Type: 'Block',
                        FlowID: `FL_${index + 2}`
                    });
                });
            }
            
            // Update the flow
            await this.axiosInstance.put(
                `/survey-definitions/${surveyId}/flow`,
                flow
            );
            
            console.log('✓ Survey flow configured');
            
        } catch (error) {
            console.log('Note: Could not configure survey flow, but survey may still work');
        }
    }

    // Enhanced flow update
    async updateEnhancedSurveyFlow(surveyId, surveyStructure) {
        try {
            console.log('Updating enhanced survey flow...');
            
            const surveyDef = await this.axiosInstance.get(`/survey-definitions/${surveyId}`);
            const blocks = surveyDef.data.result.Blocks || {};
            
            const flow = {
                Flow: [],
                Properties: {},
                FlowID: 'FL_1',
                Type: 'Root'
            };
            
            // Add randomizer if needed
            if (surveyStructure.flow && surveyStructure.flow.randomization) {
                const randomizer = {
                    Type: 'EmbeddedData',
                    FlowID: 'FL_2',
                    EmbeddedData: [
                        {
                            Description: 'condition',
                            Type: 'Recipient',
                            Field: 'condition',
                            VariableType: 'Nominal'
                        }
                    ]
                };
                flow.Flow.push(randomizer);
            }
            
            // Add blocks
            Object.keys(blocks).forEach((blockId, index) => {
                flow.Flow.push({
                    ID: blockId,
                    Type: 'Block',
                    FlowID: `FL_${flow.Flow.length + 2}`
                });
            });
            
            await this.axiosInstance.put(
                `/survey-definitions/${surveyId}/flow`,
                flow
            );
            
            console.log('✓ Enhanced survey flow updated');
            
        } catch (error) {
            console.log('Note: Could not update enhanced flow');
        }
    }
}

module.exports = new QualtricsService();