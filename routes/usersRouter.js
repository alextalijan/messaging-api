const router = require('express').Router();
const isAuthenticated = require('../utils/isAuthenticated');

// Import controller
const controller = require('../controllers/usersController');

router.post('/', controller.createUser);
router.get('/:username', controller.getUser);
router.get('/:username/chats', isAuthenticated, controller.getUserChats);
router.post('/:username/chats', isAuthenticated, controller.createUserChat);

module.exports = router;
