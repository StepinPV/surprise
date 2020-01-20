const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const nodemailer = require('./nodemailer');

const steps = [{
    log: 'Открытие сайта. День 1',
    type: 'question',
    message: 'Джэк, привет! Это твой любимый парень. Я хочу сделать для тебя сюрприз.'
}, {
    type: 'question',
    message: 'Не пугайся. Это не спам.',
    answer: {
        type : 'variants',
        value: [{
            message: 'Привет!'
        }]
    }
}, {
    type: 'question',
    message: 'Чтобы ты поверила, что это действительно я, расскажу несколько фактов о тебе:'
}, {
    type: 'question',
    message: '1. 2 февраля ты летишь во Францию. Верно?',
    answer: {
        type : 'variants',
        value: [{
            message: 'Верно'
        }]
    }
}, {
    type: 'question',
    message: '2. Ты работаешь в mail.ru маркетологом. Я прав?',
    answer: {
        type : 'variants',
        value: [{
            message: 'Да'
        }]
    }
}, {
    type: 'question',
    message: '3. У тебя есть молодой человек, которого зовут Ваня.',
    answers: [{
        message: 'Верно'
    }],
    answer: {
        type : 'variants',
        value: [{
            message: 'Верно'
        }]
    }
}, {
    type: 'question',
    message: '4. Иногда ты играешь в настольные игры с друзьями.',
    answer: {
        type : 'variants',
        value: [{
            message: 'Иногда играю в покер'
        }]
    }
}, {
    type: 'question',
    message: 'Думаю достаточно. Я знаю много другого о тебе, но не будем терять время...'
}, {
    type: 'question',
    message: 'Заинтриговал тебя?',
    answer: {
        type : 'variants',
        value: [{
            message: 'Да!'
        }]
    }
}, {
    log: 'Сценарий выполнен. 1 день.',
    type: 'question',
    message: 'Отлично. В течение завтрашнего дня, ты получишь подсказку, которая поможет пройти квест дальше. А вечером я буду ждать тебя здесь в 21 час. Договорились?:)',
    answer: {
        type : 'variants',

        value: [{
            message: 'Конечно'
        }]
    }
}, {
    log: 'Открытие сайта. День 2',
    type: 'question',
    time: new Date(2020, 0, 20, 16, 0, 0).getTime(),
    message: 'Привет! Соскучилась?)',
    answer: {
        type : 'variants',
        value: [{
            message: 'Привет)'
        }]
    }
}, {
    type: 'question',
    message: 'Спасибо, что делаешь все так, как я говорю.'
}, {
    type: 'question',
    message: 'Как я и обещал, сегодня мы продолжим...'
}, {
    type: 'question',
    message: 'Ты получила букет от меня?',
    answer: {
        type : 'variants',
        value: [{
            message: 'Да'
        }]
    }
}, {
    type: 'question',
    message: 'Надеюсь, что он тебе понравился и мне удалось немного тебя порадовать.'
}, {
    type: 'question',
    message: 'В букете, который я тебе отправил, был листочек с паролем'
}, {
    type: 'question',
    message: 'Введи его и узнаешь кто я)',
    answer: {
        type : 'password',
        placeholder: 'Пароль',
        value: 'ВНЛ'
    }
}, {
    log: 'Сценарий выполнен. 2 день.',
    type: 'question',
    message: 'Я решил сделать мини-квест, чтобы мы немного повеселились. Но это еще, конечно же, не все. Зайди сюда завтра в 22:00. Я подготовил для тебя еще кое-что. И обязательно будь в это время дома.',
    answer: {
        type : 'variants',
        value: [{
            message: 'Хорошо)'
        }]
    }
}, {
    log: 'Открытие сайта. День 3',
    type: 'question',
    time: new Date(2020, 0, 20, 16, 0, 0).getTime(),
    message: 'Привет, Насть) Ну что же, как я и обещал я приготовил для тебя еще один подарок.'
}, {
    type: 'question',
    time: new Date(2020, 0, 20, 16, 0, 0).getTime(),
    message: 'Зайди в нашу комнату и выключи свет. Не спрашивай зачем, так нужно)',
    answer: {
        type : 'variants',
        value: [{
            message: 'Выключила'
        }]
    }
}, {
    type: 'question',
    message: 'Теперь выйди на балкон',
    answer: {
        type : 'variants',
        value: [{
            message: 'Вышла'
        }]
    }
}, {
    log: 'Вышла на балкон',
    type: 'question',
    message: 'Ты готова?)',
    answer: {
        type : 'variants',
        value: [{
            message: 'Да'
        }]
    }
}, {
    log: 'Приготовиться запускать салют',
    type: 'question',
    message: 'Точно?',
    answer: {
        type : 'variants',
        value: [{
            message: 'Да!'
        }]
    }
}, {
    type: 'question',
    message: 'Ожидай минуту.',
    answer: {
        type : 'variants',
        value: [{
            message: 'Хорошо)'
        }]
    }
}, {
    log: 'Запуск',
    type: 'finish'
}];

const data = {
  activeStep: 0,
  stepsData: {},
  timestamps: {
      bot: {},
      human: {}
  }
};

const app = express();
const PORT = 4000;

app.set('port', PORT);

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/api/load-data', (req, res, next) => {
    try {
        nodemailer.send('Открытие сайта');
        res.json({ steps, data });
        res.end();
    } catch(err) {
        next(err);
    }
});

const checkLog = (index) => {
    if (steps[index].log) {
        nodemailer.send(steps[index].log);
    }
};

app.get('/api/send-message', (req, res, next) => {
    try {
        let stepIndex = data.activeStep;
        checkLog(stepIndex);

        data.timestamps.bot[stepIndex] = req.query.timestamp;

        while(!steps[stepIndex].answer) {
            stepIndex++;

            data.timestamps.bot[stepIndex] = req.query.timestamp;
            checkLog(stepIndex);
        }

        data.stepsData[stepIndex] = {
            message: req.query.message
        };
        data.timestamps.human[stepIndex] = req.query.timestamp;

        data.activeStep = stepIndex + 1;

        checkLog(data.activeStep);

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







