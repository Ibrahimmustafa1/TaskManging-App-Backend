let taskModel = require('../models/task.model')
let AppError = require('../utils/AppError')
let userModel = require('../models/user.model')
let createTask = async (req, res) => {

    let image
    if (req.file) {
        image = 'http://localhost:3000/' + req.file.filename
    }
    else {
        image = req.body.image
    }
    let { title, userId, description, deadline } = req.body
    let task = await taskModel.create({ title, userId, description, image, deadline })
    let user = await userModel.findById(userId)
    user.tasks.push(task)
    await user.save()
    res.json(task)

}
let editTask = async (req, res) => {
    console.log('x')
    let image
    if (req.file) {
        image = 'http://localhost:3000/' + req.file.filename
    }
    else {
        image = req.body.image
    }
    let taskId = req.params.taskId
    let { title, userId, description, deadline } = req.body
    let newTask = await taskModel.findByIdAndUpdate(taskId, { title, userId, description, image, deadline }, { new: true })
    res.json(newTask)
}
let deleteTask = async (req, res) => {
    console.log('x')
    let { taskId } = req.params
    await taskModel.findByIdAndDelete(taskId)
    res.json({ msg: "Task Removed" })
}
let getTasks = async (req, res, next) => {
 
    let page = req.query.page || 1
    let limit = 10
    let filters = filter(req.query)
    console.log(filters)
    let tasks = await taskModel.find(filters).skip((page - 1) * limit).limit(limit).populate('userId', "firstName lastName")
    let allTasksNumber = await taskModel.countDocuments(filters)
    console.log(filters.status)
    res.json({ tasks, allTasksNumber })
}

let getUserTasks = async (req, res, next) => {
    let page = req.query.page || 1
    let limit = 10
    let allTasksNumber = await taskModel.countDocuments({userId: req.user,status:'In-Progress'})
    let userTasks = await taskModel.find({ userId: req.user,status:'In-Progress' }).skip((page - 1) * limit).limit(limit).populate('userId', "firstName lastName")
    res.json({ userTasks, allTasksNumber })
}
let taskDetails = async (req, res) => {
    console.log('x')
    let { taskId } = req.params
    let task = await taskModel.findById(taskId).populate('userId')
    res.send({ Task: task })
}
let completeTask = async (req, res) => {
    console.log('x')
    let { taskId } = req.params
    await taskModel.findByIdAndUpdate(taskId, { status: 'completed' })
    res.send({ msg: "task completed" })
}
module.exports = {
    createTask, deleteTask, editTask, getTasks, getUserTasks, taskDetails, completeTask
}
let filter = (params) => {
    let filter = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value && key !== 'keyword' && key !== 'from' && key !== 'to' && key !== 'page' && key !== 'limit') {
            filter[key] = value
        }
        if (key === 'keyword') {
            filter.title = { $regex: value, $options: 'i' }
        }
        if (key === 'to') {
            filter.deadline = { $lte: value, $gte: params.from }
        }
    })
    return filter
}