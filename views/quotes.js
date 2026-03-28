const express = require('express');
const router = express.Router();
const formController = require('../controllers/crud');
const { isAuthenticated } = require("../middleware/auth");

router.get('/', formController.getAllForms);
router.get('/:id', formController.getFormById);
router.post('/', isAuthenticated, formController.createForm);
router.put('/:id', isAuthenticated, formController.updateForm);
router.delete('/:id', isAuthenticated, formController.deleteForm);

module.exports = router;