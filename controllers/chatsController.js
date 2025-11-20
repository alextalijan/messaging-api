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
            username: true,
          },
        },
      },
    });

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
