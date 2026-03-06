const express = require('express');
const router = express.Router();
const {
  getAllSymptoms,
  getSymptomById,
  searchSymptoms,
} = require('../controllers/symptomController');

router.get('/', getAllSymptoms);
router.get('/search', searchSymptoms);
router.get('/:id', getSymptomById);

module.exports = router;
