const router = require('express').Router();
const isAuthenticated = require('../utils/isAuthenticated');

// Import controller
const controller = require('../controllers/usersController');

router.get('/:username', controller.getUser);
router.get('/:username/chats', isAuthenticated, controller.getUserChats);
router.post('/:username/chats', isAuthenticated, controller.createUserChat);
router.get(
  '/:username/chats/:chatId',
  isAuthenticated,
  controller.getChatMessages
);
router.post(
  '/:username/chats/:chatId',
  isAuthenticated,
  controller.sendChatMessage
);

module.exports = router;
