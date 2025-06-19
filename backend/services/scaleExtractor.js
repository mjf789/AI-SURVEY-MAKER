// backend/services/scaleExtractor.js
const pdf = require('pdf-parse');
const fs = require('fs').promises;

class ScaleExtractorService {
  /**
   * Extract scales from PDF file
   * @param {string} filePath - Path to PDF file
   * @returns {Promise<Array>} Extracted scales with items
   */
  async extractScalesFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      
      // Extract text from PDF
      const text = data.text;
      
      // Parse scales from text
      const scales = this.parseScalesFromText(text);
      
      return scales;
    } catch (error) {
      console.error('Error extracting from PDF:', error);
      throw new Error('Failed to extract scales from PDF');
    }
  }

  /**
   * Parse scales from extracted text
   * @param {string} text - Extracted text from PDF
   * @returns {Array} Parsed scales
   */
  parseScalesFromText(text) {
    const scales = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentScale = null;
    let currentItems = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detect scale names (usually in caps or followed by "Scale")
      if (this.isScaleName(line)) {
        // Save previous scale if exists
        if (currentScale && currentItems.length > 0) {
          scales.push({
            scaleName: currentScale,
            items: currentItems.map((item, index) => ({
              id: `item_${index + 1}`,
              text: item.text,
              responseType: this.detectResponseType(item.text)
            }))
          });
        }
        
        currentScale = line;
        currentItems = [];
      }
      // Detect scale items (usually numbered)
      else if (this.isScaleItem(line)) {
        currentItems.push({
          text: this.cleanItemText(line)
        });
      }
    }
    
    // Don't forget the last scale
    if (currentScale && currentItems.length > 0) {
      scales.push({
        scaleName: currentScale,
        items: currentItems.map((item, index) => ({
          id: `item_${index + 1}`,
          text: item.text,
          responseType: this.detectResponseType(item.text)
        }))
      });
    }
    
    // If no scales found, treat the whole text as items
    if (scales.length === 0 && lines.length > 0) {
      const items = lines
        .filter(line => this.isScaleItem(line))
        .map(line => this.cleanItemText(line));
      
      if (items.length > 0) {
        scales.push({
          scaleName: 'Extracted Scale',
          items: items.map((text, index) => ({
            id: `item_${index + 1}`,
            text: text,
            responseType: 'likert7'
          }))
        });
      }
    }
    
    return scales;
  }

  /**
   * Check if a line is likely a scale name
   */
  isScaleName(line) {
    const scalePatterns = [
      /^[A-Z\s]+$/,  // All caps
      /scale\s*$/i,   // Ends with "scale"
      /inventory\s*$/i, // Ends with "inventory"
      /questionnaire\s*$/i, // Ends with "questionnaire"
      /measure\s*$/i, // Ends with "measure"
      /^(the\s+)?[\w\s]+(scale|inventory|questionnaire|measure)/i
    ];
    
    return scalePatterns.some(pattern => pattern.test(line)) && 
           line.length < 100 && // Not too long
           !this.isScaleItem(line); // Not a numbered item
  }

  /**
   * Check if a line is likely a scale item
   */
  isScaleItem(line) {
    const itemPatterns = [
      /^\d+[\.\)]\s+.+/, // 1. Item or 1) Item
      /^[a-z][\.\)]\s+.+/i, // a. Item or a) Item
      /^[\u2022\u2023\u25E6\u2043\u2219]\s+.+/, // Bullet points
      /^[-*]\s+.+/, // Dash or asterisk bullets
    ];
    
    return itemPatterns.some(pattern => pattern.test(line)) ||
           (line.length > 10 && line.length < 200 && /^[A-Z]/.test(line));
  }

  /**
   * Clean item text by removing numbering
   */
  cleanItemText(text) {
    return text
      .replace(/^\d+[\.\)]\s*/, '') // Remove "1." or "1)"
      .replace(/^[a-z][\.\)]\s*/i, '') // Remove "a." or "a)"
      .replace(/^[\u2022\u2023\u25E6\u2043\u2219\-*]\s*/, '') // Remove bullets
      .trim();
  }

  /**
   * Detect the likely response type for an item
   */
  detectResponseType(text) {
    const lowerText = text.toLowerCase();
    
    // Frequency items
    if (/how often|frequency|never.*always|times per/i.test(lowerText)) {
      return 'frequency7';
    }
    
    // Yes/No items
    if (/\?$/.test(text) && text.length < 50) {
      return 'yesno';
    }
    
    // Likelihood items
    if (/how likely|likelihood|probable/i.test(lowerText)) {
      return 'likelihood7';
    }
    
    // Default to Likert scale
    return 'likert7';
  }

  /**
   * Extract scales from plain text input
   */
  extractScalesFromText(text) {
    return this.parseScalesFromText(text);
  }
}

module.exports = new ScaleExtractorService();