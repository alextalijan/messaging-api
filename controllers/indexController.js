const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

module.exports = {
  register: async (req, res) => {
    const filteredUsername = req.body.username.trim().toLowerCase();

    // Check if the username already exists
    const userExists = await prisma.user.findUnique({
      where: {
        username: filteredUsername,
      },
    });
    if (userExists) {
      return res.json({ success: false, message: 'Username already exists.' });
    }

    // Create a password hash
    const hash = await bcrypt.hash(req.body.password, 10);

    // Create a new user in the database
    await prisma.user.create({
      data: {
        username: filteredUsername,
        hash,
      },
    });

    res.json({ success: true, message: 'User created.' });
  },
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      res.json({ success: true, message: 'Logged out.' });
    });
  },
};
