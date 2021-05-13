const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    req.session.destroy();
    res.clearCookie('AuthCookie')
    res.render('general/login')
  });

module.exports = router;