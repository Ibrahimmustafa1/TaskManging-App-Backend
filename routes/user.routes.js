const router = require('express').Router()
const catchAsync = require('../utils/catchAsync')
const { userLogin, userRegister, AdminRegister, getAllusers, getUser,deleteUser } = require('../controllers/user.controller')
const userValidator = require('../validations/user.validation')
let isAuth=require('../middleware/isAuth')
router.get('/', isAuth(['admin']),catchAsync(getAllusers))
router.get('/:id',isAuth(['admin']), catchAsync(getUser))
router.post('/login', catchAsync(userLogin))
router.post('/register',userValidator, catchAsync(userRegister))
router.post('/admin/register', catchAsync(AdminRegister))
router.delete('/:id',catchAsync(deleteUser))

module.exports = router
