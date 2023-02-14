const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
module.exports =
    mongoose.connect('mongodb://127.0.0.1:27017/managingTasks').then(() => {
        console.log('DB Conected')
    }).catch((e) => {
        console.log(e)
    })
