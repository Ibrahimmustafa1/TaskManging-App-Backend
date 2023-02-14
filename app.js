const express = require('express')
const app = express()
const db = require('./dbconnection')
const cors = require('cors')
const path=require('path')
let userRoutes=require('./routes/user.routes')
let taskRoutes=require('./routes/task.route')
app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, './uploads')));

app.use('/users', userRoutes)
app.use('/tasks', taskRoutes)
app.get('/', function(req, res){
    res.send('HEllo')
})

app.use((err,req, res, next)=>{
    console.log(err)
    res.status(400).json({
        message: err.msg
    })
})
app.listen(3000, () => {
    console.log("Server run")
})