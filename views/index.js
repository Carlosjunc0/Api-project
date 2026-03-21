const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //#swagger.tags = ['Hello World']
  res.send('This is a simple API for managing quotes and forms. Please refer to the documentation for more details.');
});
  
router.use('/form', require('./quotes'));

module.exports = router;