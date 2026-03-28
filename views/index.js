const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.use('/form', require('./quotes'));
router.use('/contacts', require('./contacts'));



module.exports = router;