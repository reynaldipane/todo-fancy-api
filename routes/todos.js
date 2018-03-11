const express        = require('express');
const router         = express.Router();
const todoController = require('../controllers/ToDoController')
const auth           = require('../middlewares/auth')

router.get('/', auth.check, todoController.findAll)
router.post('/create', auth.check, todoController.create)
router.put('/update/:id', auth.check, todoController.update)
router.delete('/delete/:id', auth.check, todoController.delete)
router.post('/search/:userid', auth.check, todoController.userSearch)

module.exports = router;