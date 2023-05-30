const express = require("express")
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const db = require('../../db/index')
const serviceUser = require('../services/serviceUser')
let { User, Article } = db

const signup = async (req, res) => {
    const userJoiObject = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required(),
    }).validate(req.body, {
        abortEarly: true
    })
    if (userJoiObject.error) {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: userJoiObject.error.details[0].message
        }

        res.status(500).json(returnData)

    }
    if (req.body.password != req.body.confirmPassword) {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: "Password And Confirm Password must be same"
        }

        res.status(500).json(returnData)
    }
    let userData = await User.findOne({
        email: req.body.email
    })
    // console.log('req.body_____', req.body);
    // console.log('userData_______', userData);
    if (userData != null) {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: "User Already Exist"
        }

        res.status(500).json(returnData)
    } else {
        let userObj = new User(req.body)
        let saveUser = await userObj.save()
        console.log('saveUser____', saveUser);
        let tokenData = {
            userId: saveUser._id,
        }
        let token = jwt.sign(tokenData, process.env.JWT_Private_Key, { expiresIn: '48h' });
        let returnData = {
            statusCode: 200,
            data: {
                data: { userId: saveUser._id, token: token }
            },
            error: false,
            message: "Successfully Sign Up"
        }

        res.status(200).json(returnData)
    }
}



const login = async (req, res) => {
    const userJoiObject = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }).validate(req.body, {
        abortEarly: true
    })
    if (userJoiObject.error) {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: userJoiObject.error.details[0].message
        }

        res.status(500).json(returnData)

    }

    let userData = await serviceUser.verifyAccount(req.body);
    console.log('userData_____$$$$$$$@@@@@@@@@', userData);
    if (userData.statusCode == 200) {
        let tokenData = {
            userId: userData.data._id,
            userName: userData.data.userName
        }
        let token = jwt.sign(tokenData, process.env.JWT_Private_Key, { expiresIn: '48h' });
        let returnData = {
            statusCode: 200,
            data: {
                data: { email: req.body.email, token: token }
            },
            error: false,
            message: "Login Successfully"
        }
        res.status(200).json(returnData)
    }
    else {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: "Incorrect Password"
        }

        res.status(500).json(returnData)
    }
}


const createArticles = async (req, res) => {
    const userJoiObject = Joi.object({
        title: Joi.string().required(),
        descriptions: Joi.string().required(),
    }).validate(req.body, {
        abortEarly: true
    })
    if (userJoiObject.error) {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: userJoiObject.error.details[0].message
        }

        res.status(500).json(returnData)

    }
    let articleObj = new Article({ ...req.body, author: req.user.userId })
    let saveArticle = await articleObj.save()
    console.log('saveArticle____', saveArticle);
    let returnData = {
        statusCode: 200,
        data: {
            data: saveArticle
        },
        error: false,
        message: "Successfully Create Article"
    }

    res.status(200).json(returnData)

}


const articles = async (req, res) => {
    let articlesData = await Article.find()
    console.log('articlesData_____$$$$$$$@@@@@@@@@', articlesData);
    if (articlesData && articlesData.length > 0) {
        let returnData = {
            statusCode: 200,
            data: {
                data: articlesData
            },
            error: false,
            message: "Success"
        }
        res.status(200).json(returnData)
    }
    else {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: "Not Found"
        }

        res.status(500).json(returnData)
    }
}

const updateUserProfile = async (req, res) => {
    const userJoiObject = Joi.object({
        name: Joi.string().required(),
        age: Joi.string().required(),
    }).validate(req.body, {
        abortEarly: true
    })
    if (userJoiObject.error) {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: userJoiObject.error.details[0].message
        }

        res.status(500).json(returnData)

    }
    let userData = await User.findOne({ _id: req.user.userId })
    console.log('userData_____$$$$$$$@@@@@@@@@', userData);
    if (userData != null) {

        userData.name = req.body.name;
        userData.age = req.body.age;
        await userData.save()
        let returnData = {
            statusCode: 200,
            data: {
                data: userData
            },
            error: false,
            message: "Success"
        }
        res.status(200).json(returnData)
    }
    else {
        let returnData = {
            statusCode: 500,
            data: {
                data: null
            },
            error: true,
            message: "Not Found"
        }

        res.status(500).json(returnData)
    }
}


router.post('/signup', signup)
router.post('/login', login)
router.post('/createArticles', createArticles)
router.post('/articles', articles)
router.post('/updateUserProfile', updateUserProfile)

module.exports = router;
