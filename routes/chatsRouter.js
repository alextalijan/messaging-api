const router = require('express').Router();
const isAuthenticated = require('../utils/isAuthenticated');
const controller = require('../controllers/chatsController');

router.post('/', isAuthenticated, controller.createChat);
router.get('/:chatId', isAuthenticated, controller.getChatMessages);
router.post('/:chatId', isAuthenticated, controller.sendChatMessage);

module.exports = router;
