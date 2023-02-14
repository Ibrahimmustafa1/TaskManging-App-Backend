const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const AppError = require("../utils/AppError")
module.exports = ([...roles]) => {
    return async (req, res, next) => {
        console.log('isAuth')
        if (req.headers.token) {
            let token = req.headers.token
            jwt.verify(token, 'private', async function (err, decoded) {
                if (!err) {
                    let userId = decoded.userId
                    req.user = userId
                    let user = await userModel.findById(userId)
                    if (user) {
                        if (roles.includes(user.role)) {
                            console.log('next')
                            next()
                        }
                        else {
                            next(new AppError(404, 'U are Not Authorized'))
                        }
                    }
                    else {
                        next(new AppError(404, 'User Not Found'))
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
} 
