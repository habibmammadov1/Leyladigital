const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/', portfolioController.getPortfolioItems);
router.get('/:slug', portfolioController.getPortfolioItemBySlug);

module.exports = router;
