// backend/services/hypothesisExtractor.js
const OpenAI = require('openai');

class HypothesisExtractorService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Extract dependent variables from multiple hypotheses
   * @param {Array} hypotheses - Array of hypothesis strings
   * @returns {Promise<Object>} Extracted variables and relationships
   */
  async extractDVsFromHypotheses(hypotheses) {
    try {
      const prompt = `You are a research methods expert. Analyze these research hypotheses and extract:
1. Independent Variables (IVs)
2. Dependent Variables (DVs) 
3. The relationship between them

Hypotheses:
${hypotheses.map((h, i) => `H${i + 1}: ${h}`).join('\n')}

For each hypothesis, identify:
- The IV (what is being manipulated/changed)
- The DV (what is being measured as the outcome)
- The direction/nature of the relationship

Return the results in this exact JSON format:
{
  "hypotheses": [
    {
      "original": "original hypothesis text",
      "iv": "independent variable name",
      "dv": "dependent variable name",
      "relationship": "increases/decreases/affects/etc",
      "parsed": true
    }
  ],
  "uniqueDVs": [
    {
      "name": "dependent variable name",
      "hypothesisIndices": [0, 1],
      "suggestedMeasures": ["suggested scale 1", "suggested scale 2"]
    }
  ],
  "uniqueIVs": [
    {
      "name": "independent variable name",
      "hypothesisIndices": [0],
      "suggestedLevels": ["level 1", "level 2"]
    }
  ]
}

Common patterns to recognize:
- "X → Y" or "X -> Y" means X affects Y
- "The effect of X on Y" means X is IV, Y is DV
- "X influences/impacts/affects Y" means X is IV, Y is DV
- "Higher X leads to higher/lower Y" means X is IV, Y is DV

Be careful to:
- Identify the actual variables, not just descriptive phrases
- Merge similar DVs (e.g., "attitudes" and "attitude" are the same)
- Suggest appropriate psychological scales when possible

IMPORTANT: Return ONLY the JSON object, no additional text before or after.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in research methods and experimental design. Always return valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      });

      const content = response.choices[0].message.content;
      
      // Parse JSON from the response
      let result;
      try {
        // Try to find JSON in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, try parsing the whole content
          result = JSON.parse(content);
        }
      } catch (parseError) {
        console.error('Failed to parse LLM response:', content);
        console.error('Parse error:', parseError);
        // Fallback to regex-based extraction
        return this.fallbackExtraction(hypotheses);
      }

      return this.validateAndEnrichExtraction(result);
      
    } catch (error) {
      console.error('Error extracting DVs:', error);
      // Fallback to regex-based extraction
      return this.fallbackExtraction(hypotheses);
    }
  }

  /**
   * Validate and enrich the LLM extraction with additional metadata
   */
  validateAndEnrichExtraction(extraction) {
    // Ensure we have the required structure
    if (!extraction.hypotheses) {
      extraction.hypotheses = [];
    }
    if (!extraction.uniqueDVs) {
      extraction.uniqueDVs = [];
    }
    if (!extraction.uniqueIVs) {
      extraction.uniqueIVs = [];
    }

    // Add IDs to all objects
    extraction.hypotheses = extraction.hypotheses.map((h, i) => ({
      ...h,
      id: `h_${Date.now()}_${i}`,
      parsed: h.parsed !== false // Default to true if not specified
    }));

    extraction.uniqueDVs = extraction.uniqueDVs.map((dv, i) => ({
      ...dv,
      id: `dv_${Date.now()}_${i}`,
      operationalizations: [],
      suggestedMeasures: dv.suggestedMeasures || []
    }));

    extraction.uniqueIVs = extraction.uniqueIVs.map((iv, i) => ({
      ...iv,
      id: `iv_${Date.now()}_${i}`,
      suggestedLevels: iv.suggestedLevels || []
    }));

    return extraction;
  }

  /**
   * Fallback regex-based extraction when LLM fails
   */
  fallbackExtraction(hypotheses) {
    const patterns = [
      { regex: /(.+?)\s*(?:→|->)\s*(.+)/, type: 'arrow' },
      { regex: /(.+?)\s+(?:affects?|influences?|impacts?|predicts?)\s+(.+)/i, type: 'verb' },
      { regex: /The\s+effect\s+of\s+(.+?)\s+on\s+(.+)/i, type: 'effect' },
      { regex: /(.+?)\s+will\s+(?:increase|decrease|improve|reduce)\s+(.+)/i, type: 'directional' },
      { regex: /(.+?)\s+(?:is\s+)?(?:associated|correlated|related)\s+(?:with|to)\s+(.+)/i, type: 'correlation' },
      { regex: /(.+?)\s+and\s+(.+)/i, type: 'simple' } // Simple "X and Y" pattern
    ];

    const results = {
      hypotheses: [],
      uniqueDVs: new Map(),
      uniqueIVs: new Map()
    };

    hypotheses.forEach((hyp, index) => {
      let parsed = false;
      let iv = null;
      let dv = null;
      let relationship = 'affects';

      // Try each pattern
      for (const { regex, type } of patterns) {
        const match = hyp.match(regex);
        if (match) {
          iv = match[1].trim();
          dv = match[2].trim();
          parsed = true;
          
          if (type === 'directional') {
            relationship = hyp.match(/increase/) ? 'increases' : 
                         hyp.match(/decrease/) ? 'decreases' :
                         hyp.match(/improve/) ? 'improves' : 'reduces';
          } else if (type === 'correlation') {
            relationship = 'is associated with';
          } else if (type === 'simple') {
            relationship = 'is related to';
          }
          break;
        }
      }

      // If no pattern matched, try to extract based on common words
      if (!parsed && hyp.length > 0) {
        // Look for common DV keywords
        const dvKeywords = ['performance', 'satisfaction', 'anxiety', 'depression', 'scores', 'levels', 'outcomes', 'grades', 'achievement', 'behavior', 'attitudes'];
        const ivKeywords = ['treatment', 'intervention', 'exposure', 'use', 'usage', 'social media', 'therapy', 'training'];
        
        // Try to identify variables based on keywords
        for (const keyword of dvKeywords) {
          if (hyp.toLowerCase().includes(keyword)) {
            dv = keyword;
            // Try to find an IV
            for (const ivKeyword of ivKeywords) {
              if (hyp.toLowerCase().includes(ivKeyword)) {
                iv = ivKeyword;
                parsed = true;
                break;
              }
            }
            if (parsed) break;
          }
        }

        // Last resort: assume the hypothesis mentions variables in some way
        if (!parsed) {
          const words = hyp.split(/\s+/);
          if (words.length >= 2) {
            iv = words[0];
            dv = words[words.length - 1];
            parsed = true;
          }
        }
      }

      results.hypotheses.push({
        id: `h_${Date.now()}_${index}`,
        original: hyp,
        iv,
        dv,
        relationship,
        parsed
      });

      // Collect unique DVs and IVs
      if (dv) {
        const dvKey = dv.toLowerCase();
        if (!results.uniqueDVs.has(dvKey)) {
          results.uniqueDVs.set(dvKey, {
            name: dv,
            hypothesisIndices: [index]
          });
        } else {
          results.uniqueDVs.get(dvKey).hypothesisIndices.push(index);
        }
      }

      if (iv) {
        const ivKey = iv.toLowerCase();
        if (!results.uniqueIVs.has(ivKey)) {
          results.uniqueIVs.set(ivKey, {
            name: iv,
            hypothesisIndices: [index]
          });
        } else {
          results.uniqueIVs.get(ivKey).hypothesisIndices.push(index);
        }
      }
    });

    return {
      hypotheses: results.hypotheses,
      uniqueDVs: Array.from(results.uniqueDVs.values()).map((dv, i) => ({
        ...dv,
        id: `dv_${Date.now()}_${i}`,
        operationalizations: [],
        suggestedMeasures: this.getSuggestedMeasures(dv.name)
      })),
      uniqueIVs: Array.from(results.uniqueIVs.values()).map((iv, i) => ({
        ...iv,
        id: `iv_${Date.now()}_${i}`,
        suggestedLevels: []
      }))
    };
  }

  /**
   * Get suggested measures based on DV name
   */
  getSuggestedMeasures(dvName) {
    const commonScales = {
      'anxiety': ['State-Trait Anxiety Inventory (STAI)', 'Beck Anxiety Inventory (BAI)', 'Generalized Anxiety Disorder 7 (GAD-7)'],
      'depression': ['Beck Depression Inventory (BDI)', 'Patient Health Questionnaire-9 (PHQ-9)', 'Center for Epidemiologic Studies Depression Scale (CES-D)'],
      'self-esteem': ['Rosenberg Self-Esteem Scale', 'State Self-Esteem Scale', 'Coopersmith Self-Esteem Inventory'],
      'stress': ['Perceived Stress Scale (PSS)', 'Depression Anxiety Stress Scales (DASS)', 'Stress Response Inventory'],
      'satisfaction': ['Satisfaction with Life Scale (SWLS)', 'Customer Satisfaction Scale', 'Job Satisfaction Survey'],
      'attitude': ['Attitude Scale', 'Semantic Differential Scale', 'Likert Scale Items'],
      'behavior': ['Behavioral Checklist', 'Frequency Scale', 'Behavioral Intention Scale'],
      'well-being': ['PERMA Scale', 'Warwick-Edinburgh Mental Well-being Scale', 'WHO-5 Well-Being Index'],
      'performance': ['Academic Performance Scale', 'Task Performance Measure', 'Performance Rating Scale'],
      'grades': ['GPA', 'Course Grades', 'Academic Achievement Scale'],
      'achievement': ['Academic Achievement Scale', 'Achievement Goal Questionnaire', 'Achievement Motivation Scale']
    };

    const dvLower = dvName.toLowerCase();
    for (const [keyword, scales] of Object.entries(commonScales)) {
      if (dvLower.includes(keyword)) {
        return scales;
      }
    }

    return ['Custom Scale', 'Likert Scale', 'Self-Report Measure'];
  }

  /**
   * Suggest appropriate scales for a dependent variable
   */
  async suggestScalesForDV(dvName) {
    // First check common scales
    const commonSuggestions = this.getSuggestedMeasures(dvName);
    if (commonSuggestions.length > 0 && commonSuggestions[0] !== 'Custom Scale') {
      return commonSuggestions;
    }

    // If no good match, use LLM to suggest
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Suggest 3 validated psychological scales or measures for assessing "${dvName}". Return only scale names, one per line.`
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      });

      return response.choices[0].message.content
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 3);
    } catch (error) {
      console.error('Error suggesting scales:', error);
      return ['Custom Likert Scale', 'Behavioral Measure', 'Self-Report Questionnaire'];
    }
  }
}

module.exports = new HypothesisExtractorService();