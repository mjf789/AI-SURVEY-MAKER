// backend/routes/enhancedSurvey.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Services
const hypothesisExtractor = require('../services/hypothesisExtractor');
const qsfGenerator = require('../services/qsfGenerator');
const scaleExtractor = require('../services/scaleExtractor');
const qualtricsService = require('../services/qualtrics');

// Configure multer for PDF uploads
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
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * Extract dependent variables from hypotheses
 */
router.post('/extract-dvs', async (req, res) => {
  try {
    const { hypotheses } = req.body;
    
    if (!hypotheses || !Array.isArray(hypotheses)) {
      return res.status(400).json({ 
        error: 'Hypotheses array is required' 
      });
    }

    console.log('Extracting DVs from hypotheses:', hypotheses);
    
    const extraction = await hypothesisExtractor.extractDVsFromHypotheses(hypotheses);
    
    res.json({
      success: true,
      extraction: extraction,
      summary: {
        totalHypotheses: extraction.hypotheses.length,
        parsedHypotheses: extraction.hypotheses.filter(h => h.parsed).length,
        uniqueDVs: extraction.uniqueDVs.length,
        uniqueIVs: extraction.uniqueIVs.length
      }
    });
    
  } catch (error) {
    console.error('Error extracting DVs:', error);
    res.status(500).json({ 
      error: 'Failed to extract dependent variables',
      details: error.message 
    });
  }
});

/**
 * Parse scales from PDF
 */
router.post('/parse-scales', upload.single('scale'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }
    
    console.log('Parsing scales from PDF:', req.file.originalname);
    
    // Extract text and scales from PDF
    const scales = await scaleExtractor.extractScalesFromPDF(req.file.path);
    
    // Clean up uploaded file
    await fs.unlink(req.file.path);
    
    res.json({
      success: true,
      fileName: req.file.originalname,
      scales: scales,
      itemCount: scales.reduce((sum, scale) => sum + scale.items.length, 0)
    });
    
  } catch (error) {
    console.error('Error parsing scales:', error);
    // Clean up file on error
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ 
      error: 'Failed to parse scales from PDF',
      details: error.message 
    });
  }
});

/**
 * Generate QSF file with complete survey structure
 */
router.post('/generate-qsf', async (req, res) => {
  try {
    const { surveyData } = req.body;
    
    if (!surveyData) {
      return res.status(400).json({ 
        error: 'Survey data is required' 
      });
    }

    console.log('Generating QSF for:', surveyData.study?.title);
    
    // Generate QSF structure
    const qsf = qsfGenerator.generateQSF(surveyData);
    
    // Create download response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 
      `attachment; filename="${surveyData.study?.title?.replace(/[^a-z0-9]/gi, '_') || 'survey'}.qsf"`
    );
    
    res.json(qsf);
    
  } catch (error) {
    console.error('Error generating QSF:', error);
    res.status(500).json({ 
      error: 'Failed to generate QSF file',
      details: error.message 
    });
  }
});

/**
 * Create survey in Qualtrics directly
 */
router.post('/create-qualtrics-survey', async (req, res) => {
  try {
    const { surveyData } = req.body;
    
    if (!surveyData) {
      return res.status(400).json({ 
        error: 'Survey data is required' 
      });
    }

    console.log('Creating Qualtrics survey:', surveyData.study?.title);
    
    // Generate QSF
    const qsf = qsfGenerator.generateQSF(surveyData);
    
    // Upload to Qualtrics
    const surveyId = await qualtricsService.importSurvey(
      surveyData.study?.title || 'Research Survey',
      qsf
    );
    
    // Get survey URL
    const surveyUrl = await qualtricsService.getSurveyUrl(surveyId);
    
    res.json({
      success: true,
      surveyId: surveyId,
      surveyUrl: surveyUrl,
      message: 'Survey created successfully in Qualtrics'
    });
    
  } catch (error) {
    console.error('Error creating Qualtrics survey:', error);
    res.status(500).json({ 
      error: 'Failed to create survey in Qualtrics',
      details: error.message 
    });
  }
});

/**
 * Apply randomization settings to existing survey
 */
router.post('/apply-randomization', async (req, res) => {
  try {
    const { surveyId, randomization } = req.body;
    
    if (!surveyId || !randomization) {
      return res.status(400).json({ 
        error: 'Survey ID and randomization settings are required' 
      });
    }

    console.log('Applying randomization to survey:', surveyId);
    
    // Update survey flow with randomization
    await qualtricsService.updateSurveyFlow(surveyId, randomization);
    
    res.json({
      success: true,
      message: 'Randomization settings applied successfully'
    });
    
  } catch (error) {
    console.error('Error applying randomization:', error);
    res.status(500).json({ 
      error: 'Failed to apply randomization settings',
      details: error.message 
    });
  }
});

/**
 * Get suggested scales for a DV
 */
router.get('/suggest-scales/:dvName', async (req, res) => {
  try {
    const { dvName } = req.params;
    
    console.log('Getting scale suggestions for:', dvName);
    
    const suggestions = await hypothesisExtractor.suggestScalesForDV(dvName);
    
    res.json({
      success: true,
      dv: dvName,
      suggestions: suggestions
    });
    
  } catch (error) {
    console.error('Error suggesting scales:', error);
    res.status(500).json({ 
      error: 'Failed to get scale suggestions',
      details: error.message 
    });
  }
});

/**
 * Preview survey structure
 */
router.post('/preview-survey', async (req, res) => {
  try {
    const { surveyData } = req.body;
    
    if (!surveyData) {
      return res.status(400).json({ 
        error: 'Survey data is required' 
      });
    }

    // Generate a simplified preview structure
    const preview = {
      title: surveyData.study?.title || 'Research Survey',
      blocks: [],
      totalQuestions: 0,
      estimatedTime: 0
    };

    // Add consent block
    if (surveyData.exportSettings?.includeTemplates?.consent) {
      preview.blocks.push({
        name: 'Informed Consent',
        questions: 1,
        type: 'consent'
      });
      preview.totalQuestions += 1;
      preview.estimatedTime += 2; // minutes
    }

    // Add demographics block
    if (surveyData.exportSettings?.includeTemplates?.demographics) {
      const demoQuestions = Object.keys(surveyData.exportSettings.demographicOptions || {}).length;
      preview.blocks.push({
        name: 'Demographics',
        questions: demoQuestions,
        type: 'demographics'
      });
      preview.totalQuestions += demoQuestions;
      preview.estimatedTime += demoQuestions * 0.5;
    }

    // Add DV blocks
    if (surveyData.dependentVariables) {
      surveyData.dependentVariables.forEach(dv => {
        const totalItems = dv.operationalizations.reduce((sum, op) => 
          sum + (op.items?.length || 0), 0
        );
        preview.blocks.push({
          name: `${dv.name} Measures`,
          questions: dv.operationalizations.length,
          items: totalItems,
          type: 'measures',
          randomized: surveyData.randomization?.withinBlocks?.enabled
        });
        preview.totalQuestions += dv.operationalizations.length;
        preview.estimatedTime += totalItems * 0.25;
      });
    }

    // Add debrief
    if (surveyData.exportSettings?.includeTemplates?.debrief) {
      preview.blocks.push({
        name: 'Debriefing',
        questions: 1,
        type: 'debrief'
      });
      preview.totalQuestions += 1;
      preview.estimatedTime += 1;
    }

    preview.estimatedTime = Math.ceil(preview.estimatedTime);

    res.json({
      success: true,
      preview: preview
    });
    
  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({ 
      error: 'Failed to generate survey preview',
      details: error.message 
    });
  }
});

module.exports = router;