const express = require('express')
const apiRoutes = require('./routes/index.js')
const path = require('path')
const middleware = require('./middleware/index.js')
require('dotenv').config()
require('./config/database.js')

const port = process.env.PORT || 4500
const app = express()

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes at /api endpoint
app.use('/api', apiRoutes) 

app.get("/", (req, res) => {
    res.status(200).send({message: "This server works doesn't it??"})
});
app.use('*', (req, res, next) => {
return next(new Error("There is no such Route"))
})

// serve images from the src/uploads dir
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use(middleware.errorHandler)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})