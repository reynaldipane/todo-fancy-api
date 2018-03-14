const express        = require('express');
const router         = express.Router();
const userController = require('../controllers/UserController')
const auth           = require('../middlewares/auth')

router.get('/', (req,res) => {
  res.send('users served')
})

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.post('/signinfb', userController.signInFb)
router.get('/testjwt', auth.check, userController.testJwt)
module.exports = router;