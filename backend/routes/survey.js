// backend/routes/survey.js
const express = require('express');
const router = express.Router();
const llmService = require('../services/llm');
const qualtricsService = require('../services/qualtrics');

router.post('/generate-survey', async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ error: 'Study description is required' });
        }
        
        console.log('Processing study description:', description);
        
        // Step 1: Process description with LLM
        const surveyStructure = await llmService.parseStudyDescription(description);
        console.log('LLM parsed structure:', JSON.stringify(surveyStructure, null, 2));
        
        // Step 2: Create survey in Qualtrics
        const surveyId = await qualtricsService.createSurvey(surveyStructure);
        console.log('Created survey with ID:', surveyId);
        
        // Step 3: Add questions to the survey
        await qualtricsService.addQuestions(surveyId, surveyStructure.questions);
        
        // Step 4: Generate survey URL
        const surveyUrl = qualtricsService.getSurveyUrl(surveyId);
        
        res.json({ 
            success: true, 
            surveyId, 
            surveyUrl 
        });
        
    } catch (error) {
        console.error('Error generating survey:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate survey' 
        });
    }
});

module.exports = router;