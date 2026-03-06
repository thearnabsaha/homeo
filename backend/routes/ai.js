const express = require('express');
const router = express.Router();
const { handleAnalyzeSymptoms, handleChat, handleConsult, handleRankRemedies } = require('../controllers/aiController');

router.post('/analyze-symptoms', handleAnalyzeSymptoms);
router.post('/chat', handleChat);
router.post('/consult', handleConsult);
router.post('/rank-remedies', handleRankRemedies);

module.exports = router;
