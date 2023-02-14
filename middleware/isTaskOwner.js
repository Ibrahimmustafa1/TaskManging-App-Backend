const jwt = require('jsonwebtoken');
const taskModel = require('../models/task.model');
const AppError = require("../utils/AppError")
module.exports = (req, res, next) => {
    if (req.headers.token) {
        jwt.verify(req.headers.token, 'private', async function (err, decoded) {
            if (!err) {
                let userId = decoded.userId
                let task = await taskModel.findById(req.params.taskId)
                if (task) {
                    if (task.userId == userId) {
                        next()
                    }
                    else {
                        next(new AppError(404, 'U are Not Authorized'))
                    }
                }
                else {
                    next(new AppError(404, 'Task Not Found'))
                }
            }
            else {
                next(new AppError(404, 'Invalid Token'))
            }
        });
    }
    else {
        next(new AppError(404, 'This Route Require Authenticated User'))
    }
}