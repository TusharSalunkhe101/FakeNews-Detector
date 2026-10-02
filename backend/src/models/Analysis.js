const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claim: { type: String, required: true },
  type: { type: String, default: 'Factual Assertion' },
  status: {
    type: String,
    enum: ['Supported', 'Contradicted', 'Unsupported', 'Unverified', 'Plausible'],
    default: 'Unverified',
  },
  evidence: { type: String, default: '' },
  confidence: { type: Number, default: 0.7 },
});

const evidenceSchema = new mongoose.Schema({
  source: { type: String, required: true },
  title: { type: String, default: '' },
  url: { type: String, default: '' },
  stance: {
    type: String,
    enum: ['SUPPORTS', 'CONTRADICTS', 'NEUTRAL', 'DISCUSSES'],
    default: 'NEUTRAL',
  },
  snippet: { type: String, default: '' },
  publishedDate: { type: String, default: '' },
  reliability: { type: Number, default: 0.8 },
});

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  inputType: {
    type: String,
    enum: ['TEXT', 'URL', 'IMAGE', 'PDF', 'DEMO'],
    default: 'TEXT',
  },
  headline: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: '',
  },
  publisher: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'General',
  },
  // Classification
  prediction: {
    type: String,
    enum: ['REAL', 'LIKELY REAL', 'MISLEADING', 'LIKELY FAKE', 'UNVERIFIED'],
    required: true,
  },
  finalConfidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  confidenceLevel: {
    type: String,
    enum: [
      'Very High Confidence',
      'High Confidence',
      'Uncertain / Needs Verification',
      'Likely Misleading',
      'Likely Fake',
    ],
  },
  // Detailed Weighted Scoring Signals
  scoreBreakdown: {
    mlScore: { type: Number, default: 50 },
    llmScore: { type: Number, default: 50 },
    sourceScore: { type: Number, default: 50 },
    evidenceScore: { type: Number, default: 50 },
    linguisticScore: { type: Number, default: 50 },
  },
  aiExplanation: {
    summary: { type: String, required: true },
    keyFactors: [{ type: String }],
    recommendations: [{ type: String }],
  },
  claims: [claimSchema],
  supportingEvidence: [evidenceSchema],
  contradictingEvidence: [evidenceSchema],
  similarArticles: [
    {
      title: String,
      publisher: String,
      url: String,
      similarityScore: Number,
      date: String,
    },
  ],
  sourceCredibility: {
    sourceName: String,
    tier: String,
    credibilityScore: Number,
    isHttps: Boolean,
    domain: String,
    notes: String,
  },
  sentiment: {
    sentiment: String,
    polarity: Number,
    subjectivity: Number,
    emotion: String,
    tone: String,
  },
  suspiciousIndicators: [{ type: String }],
  isDemoData: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analysis', analysisSchema);
