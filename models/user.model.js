const mongoose = require('mongoose')
const taskModel=require('./task.model')
let userSchema = new mongoose.Schema({

    firstName: {
        type: 'String',
        required: true,
        unique: true
    },
    lastName: {
        type: 'String',
        required: true,
        unique: true
    },
    email: {
        type: 'String',
        required: true,
        unique: true
    },
    password: {
        type: 'String',
        required: true
    },
    role: {
        type: 'String', 
        default: 'user'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
}, { timeseries: true })

userSchema.post('findOneAndDelete',async function(user){
    await taskModel.deleteMany({userId: user.id})
})
module.exports = mongoose.model('User',userSchema)