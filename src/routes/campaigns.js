const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/campaignController');
const { requireAuth } = require('../middleware/auth');

// Public
router.get('/', ctrl.list);
router.get('/search', ctrl.search);
router.get('/new', requireAuth, ctrl.newForm);
router.get('/:id', ctrl.show);

// Admin
router.post('/', requireAuth, ctrl.create);
router.get('/:id/edit', requireAuth, ctrl.editForm);
router.put('/:id', requireAuth, ctrl.update);
router.delete('/:id', requireAuth, ctrl.delete);

module.exports = router;
