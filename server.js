const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const nodemailer = require('./nodemailer');
const fs = require('fs');
const punycode = require('punycode');

const files = {
    'сюрприз-для-насти-абросимовой': {
        steps: '1-steps.json',
        data: '1-data.json'
    },
    'сюрприз-для-веры-березиной': {
        steps: '2-steps.json',
        data: '2-data.json'
    },
    default: {
        steps: '2-steps.json',
        data: '2-data.json'
    }
};

const defaultData = {
    "activeStep": 0,
    "stepsData": {},
    "timestamps": {
        "bot": {},
        "human": {}
    }
};

const app = express();
const PORT = 112;

app.set('port', PORT);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'build')));

const getSteps = (key) => {
    const paths = files[key] || file['default'];
    return JSON.parse(fs.readFileSync(paths['steps']));
};

const getData = (key) => {
    const paths = files[key] || file['default'];
    return JSON.parse(fs.readFileSync(paths['data']));
};

const setData = (key, data) => {
    const paths = files[key] || file['default'];
    return fs.writeFileSync(paths['data'], JSON.stringify(data));
};

const decodeHost = (host) => {
    try {
        return punycode.decode(host);
    } catch(err) {
        return 'default';
    }
};

const getStepsAndData = (host) => {
    const decodedHost = decodeHost(host);

    return {
        steps: getSteps(decodedHost),
        data: getData(decodedHost),
        host: decodedHost
    };
};

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/reset', (req, res, next) => {
    try {
        const decodedHost = decodeHost(req.header('host'));

        setData(decodedHost, defaultData);
        res.write('OK');
        res.end();
    } catch(err) {
        next(err);
    }
});

app.get('/api/load-data', (req, res, next) => {
    try {
        const { steps, data, host } = getStepsAndData(req.header('host'));

        nodemailer.send(`Открытие сайта ${host}`);
        res.json({ steps, data });
        res.end();
    } catch(err) {
        next(err);
    }
});

const checkLog = (index, steps) => {
    if (steps[index].log) {
        nodemailer.send(steps[index].log);
    }
};

app.get('/api/send-message', (req, res, next) => {
    try {
        const { steps, data, host } = getStepsAndData(req.header('host'));

        let stepIndex = data.activeStep;
        checkLog(stepIndex, steps);

        data.timestamps.bot[stepIndex] = req.query.timestamp;

        while(!steps[stepIndex].answer) {
            stepIndex++;

            data.timestamps.bot[stepIndex] = req.query.timestamp;
            checkLog(stepIndex, steps);
        }

        data.stepsData[stepIndex] = {
            message: req.query.message
        };
        data.timestamps.human[stepIndex] = req.query.timestamp;

        data.activeStep = stepIndex + 1;

        checkLog(data.activeStep, steps);

        setData(host, data);

        res.json({ steps, data });
        res.end();
    } catch(err) {
        next(err);
    }
});

if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler());
}

app.listen(PORT);
console.log(`Server is started in ${PORT} port!`);

nodemailer.init('smtp.yandex.ru', 465, 'stepinpv', '6315StepinPV63156315');







