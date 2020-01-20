const nodemailer = require('nodemailer');

let transporter = null;

module.exports.init = (host, port, login, password) => {
    transporter = nodemailer.createTransport({
        host,
        port,
        secure: true,
        auth: {
            user: login,  // to be replaced by actual username and password
            pass: password
        }
    });

    transporter.verify(function(error) {
        if (error) {
            console.log(error);
        } else {
            console.log('Mailer is ready to take our messages');
        }
    });
};

module.exports.send = (text) => {
    /*transporter.sendMail({
        from: 'stepinpv@yandex.ru',
        to: 'stepinpv@yandex.ru',
        subject: 'Сюрприз квест',
        text
    });*/

    console.log(`Сообщение: "${text}" отправлено`);
};
