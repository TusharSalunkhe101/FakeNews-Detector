const express = require('express');
const router = express.Router();
const {
  analyzeText,
  analyzeUrl,
  analyzeImage,
  analyzePdf,
  getHistory,
  getAnalysisById,
  deleteAnalysis,
  clearHistory,
  getDemoCases,
} = require('../controllers/newsController');
const { optionalAuth, protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Demo cases
router.get('/demo-cases', getDemoCases);

// Analysis endpoints
router.post('/analyze', optionalAuth, analyzeText);
router.post('/analyze-url', optionalAuth, analyzeUrl);
router.post('/analyze-image', optionalAuth, upload.single('image'), analyzeImage);
router.post('/analyze-pdf', optionalAuth, upload.single('pdf'), analyzePdf);

// History endpoints
router.delete('/history/clear', optionalAuth, clearHistory);
router.delete('/history', optionalAuth, clearHistory);
router.get('/history', optionalAuth, getHistory);
router.get('/:id', optionalAuth, getAnalysisById);
router.delete('/:id', optionalAuth, deleteAnalysis);

module.exports = router;
