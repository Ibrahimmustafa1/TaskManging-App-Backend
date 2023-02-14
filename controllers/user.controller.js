let userModel = require('../models/user.model')
let AppError = require('../utils/AppError')
let jwt = require('jsonwebtoken');
let userLogin = async (req, res) => {
    let { email, password } = req.body
    let foundUser = await userModel.findOne({ email })
    if (foundUser) {
        if (foundUser.password === password) {
            let token = jwt.sign({ userId: foundUser._id, role: foundUser.role }, 'private')
            res.json({ msg: 'Loged In Succesfulty', token })
        }
        else {
            throw new AppError(400, "Password Is In Correct")
        }
    }
    else {
        throw new AppError(400, "User Not Found")
    }
}
let userRegister = async (req, res) => {
    let { email } = req.body
    let found = await userModel.findOne({ email: email })
    if (!found) {
        let user = new userModel(req.body)
        await user.save()
        res.json({ msg: 'User Registered Successfully' })
    }
    else {
        throw new AppError(400, 'Email Already Registered')
    }
}
let AdminRegister = async (req, res) => {
    let { email, firstName, lastName, password } = req.body
    let found = await userModel.findOne({ email: email })
    if (!found) {
        let user = new userModel({ firstName, lastName, email, password, role: 'admin' })
        await user.save()
        res.json({ msg: 'User Registered Successfully' })
    }
    else {
        throw new AppError(400, 'Email Already Registered')
    }
}
let getAllusers = async (req, res) => {
    let page = req.query.page
    console.log(req.query)
    let limit;
    let filters = filter(req.query)
    let users;
    if (page) {
        
        console.log('x')
        limit = 10;
        users = await userModel.find(filters).skip((page - 1) * limit).limit(limit)
    }
    else {
        users = await userModel.find(filters)
    }
    let usersNumber = await userModel.countDocuments(filters)
    res.json({ users, usersNumber })
}
let getUser = async (req, res) => {
    let user = await userModel.findById(req.params.id)
    res.json({ user: user })
}
let deleteUser = async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id)
    res.json({ msg: 'User Deleted Successfully' })
}
let filter = (params) => {
    let filter = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value && key !== 'keyword' && key !== 'page') {
            filter[key] = value
        }
        if (key === 'keyword') {
            filter.firstName = { $regex: value, $options: 'i' }
        }
    })
    filter.role = 'user'
    return filter
}


module.exports = { userLogin, userRegister, AdminRegister, getAllusers, getUser, deleteUser }