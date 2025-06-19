// backend/services/qsfGenerator.js
const { v4: uuidv4 } = require('uuid');

class QSFGeneratorService {
  constructor() {
    this.surveyId = null;
    this.blockCounter = 0;
    this.questionCounter = 0;
  }

  /**
   * Generate complete QSF file from survey data
   * @param {Object} surveyData - Complete survey configuration
   * @returns {Object} QSF format survey
   */
  generateQSF(surveyData) {
    this.surveyId = `SV_${this.generateId()}`;
    this.blockCounter = 0;
    this.questionCounter = 0;

    const qsf = {
      SurveyEntry: {
        SurveyID: this.surveyId,
        SurveyName: surveyData.study.title || 'Research Survey',
        SurveyDescription: surveyData.study.description || null,
        SurveyOwnerID: 'UR_' + this.generateId(),
        SurveyBrandID: 'qualtrics',
        DivisionID: null,
        SurveyLanguage: 'EN',
        SurveyActiveResponseSet: 'RS_' + this.generateId(),
        SurveyStatus: 'Inactive',
        SurveyStartDate: '0000-00-00 00:00:00',
        SurveyExpirationDate: '0000-00-00 00:00:00',
        SurveyCreationDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        CreatorID: 'UR_' + this.generateId(),
        LastModified: new Date().toISOString().slice(0, 19).replace('T', ' '),
        LastAccessed: '0000-00-00 00:00:00',
        LastActivated: '0000-00-00 00:00:00',
        Deleted: null
      },
      SurveyElements: []
    };

    // Generate survey elements
    const elements = [];

    // 1. Add Blocks
    const blocks = this.generateBlocks(surveyData);
    elements.push(...blocks);

    // 2. Add Survey Flow
    const flow = this.generateSurveyFlow(surveyData, blocks);
    elements.push(flow);

    // 3. Add Questions
    const questions = this.generateQuestions(surveyData, blocks);
    elements.push(...questions);

    // 4. Add Embedded Data
    const embeddedData = this.generateEmbeddedData(surveyData);
    if (embeddedData.length > 0) {
      elements.push({
        SurveyID: this.surveyId,
        Element: 'ED',
        PrimaryAttribute: 'Flow',
        SecondaryAttribute: null,
        TertiaryAttribute: null,
        Payload: embeddedData
      });
    }

    // 5. Add Survey Options
    elements.push(this.generateSurveyOptions());

    qsf.SurveyElements = elements;
    return qsf;
  }

  /**
   * Generate survey blocks with proper randomization settings
   */
  generateBlocks(surveyData) {
    const blocks = [];
    
    // Consent Block
    if (surveyData.exportSettings?.includeTemplates?.consent) {
      blocks.push(this.createBlock('Consent', 'consent', 'Standard', false));
    }

    // Demographics Block
    if (surveyData.exportSettings?.includeTemplates?.demographics) {
      blocks.push(this.createBlock('Demographics', 'demographics', 'Standard', false));
    }

    // DV Blocks - one per DV with operationalizations
    if (surveyData.dependentVariables) {
      surveyData.dependentVariables.forEach(dv => {
        // Check if this specific block should have within-block randomization
        const shouldRandomize = surveyData.randomization?.withinBlocks?.enabled && 
                              surveyData.randomization?.withinBlocks?.blockSettings?.[`dv_${dv.id}`]?.randomizeQuestions;
        
        blocks.push(this.createBlock(
          `${dv.name} Measures`,
          `dv_${dv.id}`,
          'Standard',
          shouldRandomize
        ));
      });
    }

    // Manipulation Check Block (if experimental)
    if (surveyData.design?.type === 'experimental') {
      blocks.push(this.createBlock('Manipulation Check', 'manipulation_check', 'Standard', false));
    }

    // Debrief Block
    if (surveyData.exportSettings?.includeTemplates?.debrief) {
      blocks.push(this.createBlock('Debrief', 'debrief', 'Standard', false));
    }

    return blocks;
  }

  /**
   * Create a single block with proper randomization
   */
  createBlock(description, blockId, type = 'Standard', randomize = false) {
    const block = {
      SurveyID: this.surveyId,
      Element: 'BL',
      PrimaryAttribute: `BL_${this.generateId()}`,
      SecondaryAttribute: null,
      TertiaryAttribute: null,
      Payload: {
        Type: type,
        Description: description,
        ID: blockId,
        BlockElements: [],
        Options: {
          BlockLocking: 'false',
          RandomizeQuestions: 'false', // Will be set properly below
          BlockVisibility: 'Expanded'
        }
      }
    };

    // Set proper randomization that works for each participant
    if (randomize) {
      block.Payload.Options.RandomizeQuestions = 'RandomWithXPerPage';
      block.Payload.Options.QuestionCount = '1'; // Show 1 question per page when randomizing
      // This ensures questions are randomized for EACH participant
    }

    this.blockCounter++;
    return block;
  }

  /**
   * Generate survey flow with randomization
   */
  generateSurveyFlow(surveyData, blocks) {
    const flowElements = [];

    // Add embedded data first
    if (surveyData.design?.type === 'experimental' && surveyData.design?.conditions) {
      flowElements.push({
        Type: 'EmbeddedData',
        FlowID: 'FL_' + this.generateId(),
        EmbeddedData: [
          {
            Description: 'condition',
            Type: 'Recipient',
            Field: 'condition',
            VariableType: 'String',
            DataVisibility: [],
            AnalyzeText: false
          },
          {
            Description: 'randomID',
            Type: 'Random',
            Field: 'randomID',
            VariableType: 'String',
            DataVisibility: [],
            AnalyzeText: false
          }
        ]
      });
    }

    // Always show consent first
    const consentBlock = blocks.find(b => b.Payload.ID === 'consent');
    if (consentBlock) {
      flowElements.push({
        Type: 'Block',
        ID: consentBlock.PrimaryAttribute,
        FlowID: 'FL_' + this.generateId(),
        // Terminate survey if consent not given
        Options: {
          SkipLogic: {
            SkipLogicID: 'SL_' + this.generateId(),
            Type: 'Branch',
            BranchLogic: {
              '0': {
                '0': {
                  QuestionID: 'QID1', // Consent question
                  ChoiceLocator: 'q://QID1/SelectedChoicesRecode',
                  Operator: 'EqualTo',
                  RightOperand: '2', // "I do not consent"
                  Type: 'Expression',
                  Description: 'If Do Not Consent'
                }
              },
              Type: 'BooleanExpression',
              Flow: [{
                Type: 'EndSurvey',
                FlowID: 'FL_' + this.generateId(),
                EndingType: 'Default',
                Options: {
                  Advanced: {
                    ResponseFlag: 'ScreenOut'
                  }
                }
              }]
            }
          }
        }
      });
    }

    // Randomizer for experimental conditions (if applicable)
    if (surveyData.design?.type === 'experimental' && surveyData.design?.conditions?.length > 1) {
      const randomizer = {
        Type: 'Randomizer',
        FlowID: 'FL_' + this.generateId(),
        RandomizerType: 'EvenPresented', // Ensures even distribution
        SubSet: 1, // Each participant gets one condition
        EvenPresentation: true,
        Flow: []
      };

      surveyData.design.conditions.forEach((condition, index) => {
        randomizer.Flow.push({
          Type: 'Group',
          FlowID: 'FL_' + this.generateId(),
          Description: condition,
          Flow: [
            {
              Type: 'EmbeddedData',
              FlowID: 'FL_' + this.generateId(),
              EmbeddedData: [
                {
                  Description: 'condition',
                  Type: 'Custom',
                  Field: 'condition',
                  VariableType: 'String',
                  Value: condition
                }
              ]
            }
          ]
        });
      });

      flowElements.push(randomizer);
    }

    // Demographics (fixed position)
    const demographicsBlock = blocks.find(b => b.Payload.ID === 'demographics');
    if (demographicsBlock) {
      flowElements.push({
        Type: 'Block',
        ID: demographicsBlock.PrimaryAttribute,
        FlowID: 'FL_' + this.generateId()
      });
    }

    // DV Blocks with between-block randomization
    const dvBlocks = blocks.filter(b => b.Payload.ID.startsWith('dv_'));
    
    if (surveyData.randomization?.betweenBlocks?.enabled && dvBlocks.length > 1) {
      // This creates participant-level randomization of block order
      const blockRandomizer = {
        Type: 'Randomizer',
        FlowID: 'FL_' + this.generateId(),
        RandomizerType: 'Advanced',
        SubSet: 0, // Show all blocks but in random order
        EvenPresentation: false,
        RandomizeBlocks: true, // Key setting for between-block randomization
        Flow: dvBlocks.map(block => ({
          Type: 'Block',
          ID: block.PrimaryAttribute,
          FlowID: 'FL_' + this.generateId()
        }))
      };
      
      flowElements.push(blockRandomizer);
    } else {
      // Add DV blocks in fixed order
      dvBlocks.forEach(block => {
        flowElements.push({
          Type: 'Block',
          ID: block.PrimaryAttribute,
          FlowID: 'FL_' + this.generateId()
        });
      });
    }

    // Manipulation check (if experimental)
    const manipCheckBlock = blocks.find(b => b.Payload.ID === 'manipulation_check');
    if (manipCheckBlock) {
      flowElements.push({
        Type: 'Block',
        ID: manipCheckBlock.PrimaryAttribute,
        FlowID: 'FL_' + this.generateId()
      });
    }

    // Debrief (fixed position at end)
    const debriefBlock = blocks.find(b => b.Payload.ID === 'debrief');
    if (debriefBlock) {
      flowElements.push({
        Type: 'Block',
        ID: debriefBlock.PrimaryAttribute,
        FlowID: 'FL_' + this.generateId()
      });
    }

    return {
      SurveyID: this.surveyId,
      Element: 'FL',
      PrimaryAttribute: 'Survey Flow',
      SecondaryAttribute: null,
      TertiaryAttribute: null,
      Payload: {
        Type: 'Root',
        FlowID: 'FL_1',
        Flow: flowElements,
        Properties: {
          Count: flowElements.length,
          RemovedFieldsets: []
        }
      }
    };
  }

  /**
   * Generate all questions for the survey
   */
  generateQuestions(surveyData, blocks) {
    const questions = [];

    // Generate consent questions
    const consentBlock = blocks.find(b => b.Payload.ID === 'consent');
    if (consentBlock) {
      const consentQ = this.createConsentQuestion();
      questions.push(consentQ);
      consentBlock.Payload.BlockElements.push({
        Type: 'Question',
        QuestionID: consentQ.PrimaryAttribute
      });
    }

    // Generate demographic questions
    const demoBlock = blocks.find(b => b.Payload.ID === 'demographics');
    if (demoBlock && surveyData.exportSettings?.demographicOptions) {
      Object.entries(surveyData.exportSettings.demographicOptions).forEach(([field, config]) => {
        const q = this.createDemographicQuestion(field, config);
        questions.push(q);
        demoBlock.Payload.BlockElements.push({
          Type: 'Question',
          QuestionID: q.PrimaryAttribute
        });
      });
    }

    // Generate DV questions from operationalizations
    if (surveyData.dependentVariables) {
      surveyData.dependentVariables.forEach(dv => {
        const dvBlock = blocks.find(b => b.Payload.ID === `dv_${dv.id}`);
        if (dvBlock) {
          dv.operationalizations.forEach(op => {
            if (op.items && op.items.length > 0) {
              const matrixQ = this.createMatrixQuestion(op.scaleName, op.items);
              questions.push(matrixQ);
              dvBlock.Payload.BlockElements.push({
                Type: 'Question',
                QuestionID: matrixQ.PrimaryAttribute
              });
            }
          });
        }
      });
    }

    // Generate debrief
    const debriefBlock = blocks.find(b => b.Payload.ID === 'debrief');
    if (debriefBlock) {
      const debriefQ = this.createDebriefQuestion();
      questions.push(debriefQ);
      debriefBlock.Payload.BlockElements.push({
        Type: 'Question',
        QuestionID: debriefQ.PrimaryAttribute
      });
    }

    return questions;
  }

  /**
   * Create consent question
   */
  createConsentQuestion() {
    return {
      SurveyID: this.surveyId,
      Element: 'SQ',
      PrimaryAttribute: `QID${++this.questionCounter}`,
      SecondaryAttribute: 'Consent Form',
      TertiaryAttribute: null,
      Payload: {
        QuestionText: this.getConsentText(),
        DataExportTag: 'Q_Consent',
        QuestionType: 'MC',
        Selector: 'SAVR',
        SubSelector: 'TX',
        Configuration: {
          QuestionDescriptionOption: 'UseText'
        },
        QuestionDescription: 'Consent',
        Choices: {
          '1': {
            Display: 'I consent to participate in this study'
          },
          '2': {
            Display: 'I do not consent to participate'
          }
        },
        ChoiceOrder: ['1', '2'],
        Validation: {
          Settings: {
            ForceResponse: 'ON',
            ForceResponseType: 'ON',
            Type: 'None'
          }
        },
        Language: [],
        QuestionID: `QID${this.questionCounter}`
      }
    };
  }

  /**
   * Create demographic question based on type
   */
  createDemographicQuestion(field, config) {
    const questionId = `QID${++this.questionCounter}`;
    const questionText = this.getDemographicQuestionText(field);

    if (config.type === 'numeric') {
      return {
        SurveyID: this.surveyId,
        Element: 'SQ',
        PrimaryAttribute: questionId,
        SecondaryAttribute: field,
        TertiaryAttribute: null,
        Payload: {
          QuestionText: questionText,
          DataExportTag: `Q_${field}`,
          QuestionType: 'TE',
          Selector: 'SL',
          Configuration: {
            QuestionDescriptionOption: 'UseText',
            InputWidth: 100,
            InputHeight: 1
          },
          QuestionDescription: field,
          Validation: {
            Settings: {
              ForceResponse: 'ON',
              ForceResponseType: 'ON',
              Type: 'ContentType',
              ContentType: 'ValidNumber',
              ValidNumber: {
                Min: config.validation?.min || '1',
                Max: config.validation?.max || '999'
              }
            }
          },
          Language: [],
          QuestionID: questionId
        }
      };
    } else if (config.type === 'multiple_choice') {
      const choices = {};
      const choiceOrder = [];
      
      config.options.forEach((option, index) => {
        const choiceId = `${index + 1}`;
        choices[choiceId] = { Display: option };
        choiceOrder.push(choiceId);
      });

      return {
        SurveyID: this.surveyId,
        Element: 'SQ',
        PrimaryAttribute: questionId,
        SecondaryAttribute: field,
        TertiaryAttribute: null,
        Payload: {
          QuestionText: questionText,
          DataExportTag: `Q_${field}`,
          QuestionType: 'MC',
          Selector: 'SAVR',
          SubSelector: 'TX',
          Configuration: {
            QuestionDescriptionOption: 'UseText'
          },
          QuestionDescription: field,
          Choices: choices,
          ChoiceOrder: choiceOrder,
          Validation: {
            Settings: {
              ForceResponse: 'ON',
              ForceResponseType: 'ON',
              Type: 'None'
            }
          },
          Language: [],
          QuestionID: questionId
        }
      };
    }
  }

  /**
   * Create matrix question for scale items
   */
  createMatrixQuestion(scaleName, items) {
    const questionId = `QID${++this.questionCounter}`;
    const statements = {};
    const statementOrder = [];
    const scale = {};
    const scaleOrder = [];

    // Create statements from items
    items.forEach((item, index) => {
      const statementId = `${index + 1}`;
      statements[statementId] = { Display: item.text };
      statementOrder.push(statementId);
    });

    // Create scale points (default 7-point Likert)
    const scalePoints = [
      'Strongly Disagree',
      'Disagree',
      'Somewhat Disagree',
      'Neither Agree nor Disagree',
      'Somewhat Agree',
      'Agree',
      'Strongly Agree'
    ];

    scalePoints.forEach((point, index) => {
      const scaleId = `${index + 1}`;
      scale[scaleId] = { Display: point };
      scaleOrder.push(scaleId);
    });

    return {
      SurveyID: this.surveyId,
      Element: 'SQ',
      PrimaryAttribute: questionId,
      SecondaryAttribute: scaleName,
      TertiaryAttribute: null,
      Payload: {
        QuestionText: `<h4>${scaleName}</h4><p>Please indicate your level of agreement with each statement:</p>`,
        DataExportTag: `Q_${scaleName.replace(/\s+/g, '_')}`,
        QuestionType: 'Matrix',
        Selector: 'Likert',
        SubSelector: 'SingleAnswer',
        Configuration: {
          QuestionDescriptionOption: 'UseText',
          TextPosition: 'inline',
          ChoiceColumnWidth: 25,
          RepeatHeaders: 'none',
          WhiteSpace: 'ON',
          MobileFirst: true
        },
        QuestionDescription: scaleName,
        Choices: statements,
        ChoiceOrder: statementOrder,
        Answers: scale,
        AnswerOrder: scaleOrder,
        Validation: {
          Settings: {
            ForceResponse: 'ON',
            ForceResponseType: 'ON',
            Type: 'None'
          }
        },
        Language: [],
        QuestionID: questionId
      }
    };
  }

  /**
   * Create debrief question
   */
  createDebriefQuestion() {
    return {
      SurveyID: this.surveyId,
      Element: 'SQ',
      PrimaryAttribute: `QID${++this.questionCounter}`,
      SecondaryAttribute: 'Debrief',
      TertiaryAttribute: null,
      Payload: {
        QuestionText: this.getDebriefText(),
        DataExportTag: 'Q_Debrief',
        QuestionType: 'DB',
        Selector: 'TB',
        Configuration: {
          QuestionDescriptionOption: 'UseText'
        },
        QuestionDescription: 'Debrief',
        Validation: {
          Settings: {
            Type: 'None'
          }
        },
        Language: [],
        QuestionID: `QID${this.questionCounter}`
      }
    };
  }

  /**
   * Generate embedded data fields
   */
  generateEmbeddedData(surveyData) {
    const embeddedData = [];

    // Add condition field for experimental designs
    if (surveyData.design?.type === 'experimental') {
      embeddedData.push({
        Field: 'condition',
        Type: 'Recipient',
        Description: 'Experimental Condition',
        VariableType: 'String',
        DataVisibility: ['dashboard', 'export']
      });
    }

    // Add completion timestamp
    embeddedData.push({
      Field: 'completion_time',
      Type: 'Recipient',
      Description: 'Survey Completion Time',
      VariableType: 'String',
      DataVisibility: ['dashboard', 'export']
    });

    // Add random assignment ID
    embeddedData.push({
      Field: 'random_id',
      Type: 'Recipient',
      Description: 'Random Assignment ID',
      VariableType: 'String',
      DataVisibility: ['export']
    });

    return embeddedData;
  }

  /**
   * Generate survey options
   */
  generateSurveyOptions() {
    return {
      SurveyID: this.surveyId,
      Element: 'SO',
      PrimaryAttribute: 'Survey Options',
      SecondaryAttribute: null,
      TertiaryAttribute: null,
      Payload: {
        BackButton: 'true',
        SaveAndContinue: 'true',
        SurveyProtection: 'PublicSurvey',
        BallotBoxStuffingPrevention: 'true',
        NoIndex: 'Yes',
        SecureResponseFiles: 'true',
        SurveyExpiration: null,
        SurveyTermination: 'DefaultMessage',
        Header: '',
        Footer: '',
        ProgressBarDisplay: 'Text',
        PartialData: '+7 days',
        ValidationMessage: null,
        PreviousButton: ' ← ',
        NextButton: ' → ',
        SurveyTitle: 'Research Study',
        SkinLibrary: 'qualtrics',
        SkinType: 'templated',
        Skin: 'fresh_2022'
      }
    };
  }

  /**
   * Helper method to generate IDs
   */
  generateId() {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get consent text template
   */
  getConsentText() {
    return `<h3>Informed Consent</h3>
<p><strong>Study Title:</strong> Research Study</p>
<p><strong>Principal Investigator:</strong> [Name]</p>
<p><strong>Institution:</strong> [Institution Name]</p>

<h4>Purpose of the Study</h4>
<p>You are being invited to participate in a research study. The purpose of this study is to better understand [general study purpose].</p>

<h4>Study Procedures</h4>
<p>If you agree to participate, you will be asked to complete an online survey that will take approximately [X] minutes. The survey includes questions about [general description of measures].</p>

<h4>Risks and Benefits</h4>
<p>The risks associated with this study are minimal and no greater than those encountered in everyday life. There are no direct benefits to participating in this study, but your responses will contribute to our understanding of [research area].</p>

<h4>Confidentiality</h4>
<p>Your responses will be kept confidential. No identifying information will be collected, and all data will be stored securely. Only the research team will have access to the data.</p>

<h4>Voluntary Participation</h4>
<p>Your participation in this study is completely voluntary. You may skip any questions you do not wish to answer, and you may withdraw from the study at any time without penalty.</p>

<h4>Contact Information</h4>
<p>If you have questions about this study, please contact [PI name] at [email].</p>
<p>If you have questions about your rights as a research participant, please contact the Institutional Review Board at [IRB contact].</p>

<h4>Consent</h4>
<p>By clicking "I consent" below, you indicate that you have read and understood the information provided above, and that you voluntarily agree to participate in this research study.</p>`;
  }

  /**
   * Get demographic question text
   */
  getDemographicQuestionText(field) {
    const texts = {
      age: 'What is your age?',
      gender: 'What is your gender?',
      ethnicity: 'What is your ethnicity? (Select all that apply)',
      education: 'What is the highest level of education you have completed?'
    };
    return texts[field] || `Please provide your ${field}:`;
  }

  /**
   * Get debrief text template
   */
  getDebriefText() {
    return `<h3>Study Debriefing</h3>

<p>Thank you for participating in our study!</p>

<h4>Purpose of the Study</h4>
<p>The purpose of this study was to examine [specific research question]. We were particularly interested in understanding [key variables and relationships].</p>

<h4>Hypotheses</h4>
<p>We hypothesized that [main hypotheses]. Your responses will help us determine whether these predictions are supported.</p>

<h4>Importance</h4>
<p>This research is important because [significance of the research]. The findings may help us better understand [practical or theoretical implications].</p>

<h4>Confidentiality Reminder</h4>
<p>As a reminder, your responses are completely confidential and will only be reported in aggregate form.</p>

<h4>Further Information</h4>
<p>If you would like to learn more about this area of research, you may be interested in the following resources:</p>
<ul>
  <li>[Relevant article or book]</li>
  <li>[Relevant website or resource]</li>
</ul>

<h4>Contact Information</h4>
<p>If you have any questions or concerns about this study, please feel free to contact:</p>
<p>[PI Name] at [email]</p>

<h4>Thank You</h4>
<p>We greatly appreciate your participation in this research. Your contribution helps advance our understanding of [research area].</p>

<p><em>You may now close this window.</em></p>`;
  }
}

module.exports = new QSFGeneratorService();