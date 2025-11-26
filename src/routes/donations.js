const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/donationController');
const { requireAuth } = require('../middleware/auth');

// New donation form
router.get('/new/:campaignId', requireAuth, ctrl.newForm);

// Create donation
router.post('/', requireAuth, ctrl.create);

// Edit donation form
router.get('/:id/edit', requireAuth, ctrl.editForm);

// Update donation
router.put('/:id', requireAuth, ctrl.update);

// Delete donation
router.delete('/:id', requireAuth, ctrl.delete);

module.exports = router;
