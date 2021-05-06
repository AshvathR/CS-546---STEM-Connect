const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('general/landing', { title: "Show Finder" });
  });




module.exports = router;