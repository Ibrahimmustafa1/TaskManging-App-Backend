const mongoose = require('mongoose')
const userModel = require('./user.model')
let taskSchema = new mongoose.Schema({
    title: {
        type: 'String',
        required: true,
        unique: true,
        index:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: 'String',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    deadline: {
        type: 'String',
        required: true
    },
    status: {
        type: String,
        default: "In-Progress"
    },


}, { timestamps: true })

taskSchema.post('findOneAndRemove', async function (data) {
    let userId = data.userId
    await userModel.findByIdAndUpdate(userId, { $pull:{tasks:data._id}})
})
module.exports = mongoose.model('Task', taskSchema)