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
    // If the user requesting is not the one whose chats are
    if (req.user.username !== req.params.username) {
      // Stop them from accessing them
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized.' });
    }

    const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            id: req.user.id,
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            username: true,
          },
        },
        messages: {
          select: {
            text: true,
            date: true,
            sender: {
              select: {
                username: true,
              },
            },
          },
          orderBy: {
            date: 'desc',
          },
          take: 1,
        },
      },
    });

    // Sort the chats from latest active
    chats.sort((chatA, chatB) => {
      const dateA = chatA.messages[0].date;
      const dateB = chatB.messages[0].date;
      return dateB - dateA;
    });

    // Format the chats to exclude the user himself
    const formatted = chats.map((chat) => {
      return {
        name: chat.name,
        members: chat.members.filter((member) => member.id !== req.user.id),
        lastMessage: chat.messages[0] || null,
      };
    });

    res.json({ success: true, chats: formatted });
  },
  updateStatus: async (req, res) => {
    const updatedUser = await prisma.user.update({
      where: {
        username: req.params.username,
      },
      data: {
        status: req.body.status,
      },
      select: {
        status: true,
      },
    });

    res.json({ success: true, status: updatedUser.status });
  },
};
