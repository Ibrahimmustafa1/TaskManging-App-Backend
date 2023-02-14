const router = require('express').Router()
const catchAsync = require('../utils/catchAsync')
const { createTask, deleteTask, editTask, getTasks,getUserTasks, taskDetails,completeTask } = require('../controllers/task.controller')
const taskValidator=require('../validations/task.Validation')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image'))
        cb(null, true)
    else{
        cb(new Error('only image is supported'))
    }
}
const upload = multer({ storage: storage,fileFilter })
let isAuth = require('../middleware/isAuth')
const isOwner = require('../middleware/isTaskOwner')

router.get('/', isAuth(['admin']),catchAsync(getTasks))
router.get('/user',isAuth(['user']),catchAsync(getUserTasks))
router.get('/:taskId',isAuth(['admin','user']), catchAsync(taskDetails))
router.post('/',upload.single('image'),taskValidator, isAuth(['admin']) ,catchAsync(createTask))
router.patch('/:taskId',isAuth(['user']), isOwner,catchAsync(completeTask))
router.put('/:taskId',upload.single('image'), isAuth(['admin']) , catchAsync(editTask))
router.delete('/:taskId',isAuth(['admin']), catchAsync(deleteTask))


module.exports = router
