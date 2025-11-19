const router = require('express').Router();
const controller = require('../controllers/indexController');
const passport = require('../config/passport');

router.post('/register', controller.register);
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    // If authentication failed
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.',
      });
    }

    // Log the user in and create a session
    req.logIn(user, (err) => {
      if (err) return next(err);

      // At this point:
      // ✔ Session is created
      // ✔ Cookie "connect.sid" is set automatically
      // ✔ You DO NOT store anything in localStorage

      res.json({
        success: true,
        message: 'Login successful.',
        user: {
          id: user.id,
          username: user.username,
        },
      });
    });
  })(req, res, next);
});

module.exports = router;
