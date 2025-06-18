// backend/routes/survey.js - Enhanced version
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const llmService = require('../services/llm');
const qualtricsService = require('../services/qualtrics');
const scaleExtractorService = require('../services/scaleExtractor');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.docx', '.doc'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Extract scales from uploaded documents
router.post('/extract-scales', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        console.log('Processing file:', req.file.originalname);
        
        const fileType = path.extname(req.file.originalname).toLowerCase().slice(1);
        const scales = await scaleExtractorService.extractScalesFromFile(
            req.file.path, 
            fileType
        );
        
        // Clean up uploaded file
        await fs.unlink(req.file.path);
        
        res.json({ 
            success: true, 
            scales: scales,
            filename: req.file.originalname 
        });
        
    } catch (error) {
        console.error('Error extracting scales:', error);
        // Clean up file on error
        if (req.file && req.file.path) {
            await fs.unlink(req.file.path).catch(() => {});
        }
        res.status(500).json({ 
            error: error.message || 'Failed to extract scales from document' 
        });
    }
});

// Enhanced survey generation with extracted scales
router.post('/generate-survey-v2', async (req, res) => {
    try {
        const { overview, scales, design, flow, customQuestions } = req.body;
        
        if (!overview || !overview.title) {
            return res.status(400).json({ error: 'Study overview is required' });
        }
        
        console.log('Generating enhanced survey:', overview.title);
        
        // Step 1: Build comprehensive survey structure
        const surveyStructure = await llmService.buildEnhancedSurveyStructure({
            overview,
            scales,
            design,
            flow,
            customQuestions
        });
        
        console.log('Enhanced structure built:', JSON.stringify(surveyStructure, null, 2));
        
        // Step 2: Create survey in Qualtrics with enhanced features
        const surveyId = await qualtricsService.createEnhancedSurvey(surveyStructure);
        console.log('Created enhanced survey with ID:', surveyId);
        
        // Step 3: Set up experimental conditions if needed
        if (design && design.conditions && design.conditions.length > 0) {
            await qualtricsService.setupExperimentalConditions(surveyId, design);
        }
        
        // Step 4: Configure survey flow and logic
        await qualtricsService.configureSurveyFlow(surveyId, flow);
        
        // Step 5: Generate survey URL
        const surveyUrl = qualtricsService.getSurveyUrl(surveyId);
        
        res.json({ 
            success: true, 
            surveyId, 
            surveyUrl,
            preview: surveyStructure 
        });
        
    } catch (error) {
        console.error('Error generating enhanced survey:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate survey' 
        });
    }
});

// Get survey preview without creating in Qualtrics
router.post('/preview-survey', async (req, res) => {
    try {
        const { overview, scales, design, flow, customQuestions } = req.body;
        
        const surveyStructure = await llmService.buildEnhancedSurveyStructure({
            overview,
            scales,
            design,
            flow,
            customQuestions
        });
        
        res.json({ 
            success: true, 
            preview: surveyStructure 
        });
        
    } catch (error) {
        console.error('Error generating preview:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate preview' 
        });
    }
});

// Original endpoint for backward compatibility
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