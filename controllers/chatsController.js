module.exports = {
  createChat: async (req, res) => {
    await prisma.chat.create({
      data: {
        name: req.body.name,
        members: {
          connect: req.body.members.map((member) => ({ id: member.id })),
        },
      },
    });

    res.json({ success: true, message: `${req.body.name} chat created.` });
  },
  getChatMessages: async (req, res) => {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.chatId,
      },
      include: {
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
            date: 'asc',
          },
          take: 20,
          skip: req.body.page * 20,
        },
        members: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    // If the user is not a part of the chat, stop them from reading it
    let found = false;
    for (const member of chat.members) {
      if (member.id === req.user.id) {
        found = true;
        break;
      }
    }
    if (!found) {
      return res.json({
        success: false,
        message: 'Not authorized to see this chat.',
      });
    }

    res.json({ success: true, chat });
  },
  sendChatMessage: async (req, res) => {
    await prisma.message.create({
      data: {
        text: req.body.text,
        senderId: req.user.id,
        chatId: req.params.chatId,
      },
    });

    res.json({ success: true, message: 'Message sent successfully.' });
  },
};
