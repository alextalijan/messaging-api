const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  returnUser: (req, res) => {
    if (req.user) {
      return res.json({ user: req.user });
    }

    res.json({ user: null });
  },
  getUser: async (req, res) => {
    // Find the requested user
    const user = await prisma.user.findUnique({
      where: {
        username: req.params.username,
      },
      select: {
        username: true,
        status: true,
      },
    });

    // If the user doesn't exist, throw an error message
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      user,
    });
  },
  getUserChats: async (req, res) => {
    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            id: req.user.id,
          },
        },
      },
      select: {
        name: true,
        members: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // Format the chats to exclude the user himself
    const formatted = chats.map((chat) => {
      return {
        name: chat.name,
        members: chat.members.filter((member) => member.id !== req.user.id),
      };
    });

    res.json({ success: true, chats: formatted });
  },
  getChatMessages: async (req, res) => {
    const messages = await prisma.message.findMany({
      where: {
        chatId: req.params,
      },
    });
  },
};
