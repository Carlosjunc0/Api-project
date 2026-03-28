const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contacts');
const { isAuthenticated } = require("../middleware/auth")

router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContactById);
router.post('/', isAuthenticated, contactController.createContact);
router.put('/:id', isAuthenticated, contactController.updateContact);
router.delete('/:id', isAuthenticated, contactController.deleteContact);

module.exports = router;