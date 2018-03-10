const express = require('express');
const router  = express.Router();
const users   = require('./users');
const todos   = require('./todos');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('API work')
});

router.use('/api/users', users)
router.use('/api/todos', todos)

module.exports = router;