const db = require('../../db/index')
const { User } = db;
const bcrypt = require('bcrypt');


const verifyAccount = async (data) => {
    try {
        let userData = await getUserByEmail(data.email);
        console.log('userData_________', userData);
        if (userData && userData.data == null) {
            return ({ data: null, message: "Not Found", statusCode: 500 })
        }
        else {
            let verifyPass = null
            console.log('**************', userData.data.password, data.password);
            verifyPass = await bcrypt.compare(data.password, userData.data.password)
            console.log("verifypassverifypass______________", verifyPass)

            if (verifyPass) {
                return ({ data: userData.data, message: "SUCCESS", statusCode: 200 })
            }
            else {
                return ({ data: null, message: 'Passwords do not match', statusCode: 500 })
            }
        }

    } catch (error) {
        console.log('Error Occur', error);
        return ({ data: null, message: error.message, statusCode: 500 })
    }

}

const getUserByEmail = async (email) => {
    try {
        let userData = await User.findOne({ email: email });
        if (userData == null || userData == [] || userData.length == 0) {
            return ({ data: null, message: "Not Found", statusCode: 500 })
        }
        else {
            return ({ data: userData, message: "Success", statusCode: 200 })
        }

    } catch (error) {
        return ({ data: null, message: error.message, statusCode: 500 })
    }

}

module.exports = {
    verifyAccount
}