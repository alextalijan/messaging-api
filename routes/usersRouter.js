const router = require('express').Router();

// Import controller
const controller = require('../controllers/usersController');

router.post('/', controller.createUser);
router.get('/:username', controller.getUser);
router.get('/:username/chats', controller.getUserChats);
router.post('/:username/chats', controller.createUserChat);

module.exports = router;
