const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendMail = (data) => {
    try {
        console.log('data_____Send__Mail', data);
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        // let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, // generated ethereal user
                pass: process.env.SMTP_PASS, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: data && data.email ? data.email : '', // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<b>${data.otp} OTP valid for only 10 minutes</b>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (error) {
        console.log('error occur :', error);
    }

}

const randomString = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toString();
}
function generateKey(length = CONSTANTS.TOKEN_LENGTH) {
    var key = "";
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < length; i++) {
        key += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return key;
}
function generateOTP(length = CONSTANTS.OTP_LENGTH) {
    var key = "";
    var possible = "0123456789";
    for (var i = 0; i < length; i++) {
        key += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return key;
}

const resultdb = (statusCode, data = null) => {
    return {
      statusCode: statusCode,
      data: data
    };
  }

// sendMail().catch(console.error);

module.exports = {
    sendMail: sendMail,
    randomString: randomString,
    generateKey: generateKey,
    generateOTP: generateOTP,
    resultdb: resultdb,
}