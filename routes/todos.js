const express        = require('express');
const router         = express.Router();
const todoController = require('../controllers/ToDoController')
const auth           = require('../middlewares/auth')

router.get('/', todoController.findAll)
router.post('/translate', todoController.translate)
router.get('/:id', auth.check, todoController.findById)
router.post('/create', auth.check, todoController.create)
router.put('/update/:id', auth.check, todoController.update)
router.put('/updatetask/:id', auth.check, todoController.updateStatusTask)
router.delete('/delete/:id',  auth.check, todoController.delete)
router.post('/search/:userid', auth.check, todoController.userSearch)
router.post('/findbyuserid', todoController.findByUserId)

module.exports = router;