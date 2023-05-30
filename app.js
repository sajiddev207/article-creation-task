const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cors = require('cors')
// const { expressjwt: jwt } = require('express-jwt')
const app = express();
dotenv.config()
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL
const authenticateUserToken = require('./router/auth/userAuth')
const path = require('path');
const dir = path.join(__dirname, '/upload');
const errorHandler = require('./utils/errorHandler')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())
app.use("/upload", express.static(dir));
// app.use(morgan, 'tiny')

// import {controllerUser}  from'./router/index'
let { controllerUser } = require('./router')


app.use(authenticateUserToken())
app.use('/api', controllerUser)


app.use(errorHandler);

mongoose.connect(MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => app.listen(PORT, () => {
        console.log('Server running on Port', process.env.PORT);
    }))
    .catch(error => console.error(error));

