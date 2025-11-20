const router = require('express').Router();
const isAuthenticated = require('../utils/isAuthenticated');

// Import controller
const controller = require('../controllers/usersController');

router.get('/:username', controller.getUser);
router.get('/:username/chats', isAuthenticated, controller.getUserChats);

module.exports = router;
