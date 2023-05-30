const expressJwt = require("express-jwt");
module.exports = authJwt
function authJwt() {
    return expressJwt({
        secret: process.env.JWT_Private_Key,
        algorithms: ['HS256'],
        // isRevoked: isRevoked,
    }).unless({
        // path: ['/api/user/registerUser'],
        path: [
            { url: '/api/signup', methods: ['POST'] },
            { url: '/api/login', methods: ['POST'] },
        ],
    });
}

//     async isRevoked(req, payload, done){
//     // your code goes here for revoking
// }