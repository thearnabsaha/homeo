const express = require('express');
const router = express.Router();
const {
  getAllRemedies,
  getRemedyById,
  searchRemedies,
} = require('../controllers/remedyController');

router.get('/', getAllRemedies);
router.get('/search', searchRemedies);
router.get('/:id', getRemedyById);

module.exports = router;
