import React, { useEffect, useState } from 'react';
import Message from '../Message/Message';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import styles from './Messenger.module.css';

function Messenger({ data, sendMessage }) {
    const [messages, setMessages] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const getMessages = () => {
        const messages = [];

        for (let i = 0; i < data.data.activeStep; i++) {
            if (data.steps[i].type === 'question') {
                messages.push({
                    message: data.steps[i].message,
                    timestamp: data.data.timestamps.bot[i],
                    author: 'bot'
                });

                if (data.data.stepsData[i]) {
                    messages.push({
                        message: data.data.stepsData[i].message,
                        timestamp: data.data.timestamps.human[i],
                        author: 'human'
                    });
                }
            }
        }

        const pushNextMessage = (index) => {
            if (data.steps[index].type === 'question') {
                let message = {
                    message: data.steps[index].message,
                    timestamp: data.data.timestamps.bot[index],
                    author: 'bot',
                    type: 'writing',
                    isWriting: true,
                    answer: data.steps[index].answer
                };

                messages.push(message);
                setMessages([...messages]);

                setTimeout(() => {
                    message.isWriting = false;
                    setMessages([...messages]);

                    setTimeout(() => {
                        if (!data.steps[index].answer) {
                            pushNextMessage(index + 1);
                        }
                    }, 800);
                }, 2000);
            }
        };

        pushNextMessage(data.data.activeStep);

        setMessages(messages);
    };

    useEffect( () => {
        getMessages();
    },[data]);

    const renderMessages = () => {
        let i = 0;
        let messageCount = messages.length;
        let tempMessages = [];

        while (i < messageCount) {
            let previous = messages[i - 1];
            let current = messages[i];
            let next = messages[i + 1];
            let isMine = current.author === 'human';
            let currentMoment = current.timestamp;
            let prevBySameAuthor = false;
            let nextBySameAuthor = false;
            let startsSequence = true;
            let endsSequence = true;
            let showTimestamp = true;

            if (previous) {
                let previousMoment = previous.timestamp;
                prevBySameAuthor = previous.author === current.author;

                if (prevBySameAuthor && currentMoment - previousMoment < 1000 * 3600) {
                    startsSequence = false;
                }

                if (currentMoment - previousMoment < 1000 * 3600) {
                    showTimestamp = false;
                }
            }

            if (next) {
                let nextMoment = next.timestamp;
                nextBySameAuthor = next.author === current.author;

                if (nextBySameAuthor && nextMoment - currentMoment < 1000 * 3600) {
                    endsSequence = false;
                }
            }

            tempMessages.push(
                <Message
                    key={i}
                    isMine={isMine}
                    timestamp={current.timestamp}
                    startsSequence={startsSequence}
                    endsSequence={endsSequence}
                    showTimestamp={showTimestamp}
                    message={current.message}
                    isWriting={current.isWriting}
                />
            );

            // Proceed to the next message.
            i += 1;
        }

        return tempMessages;
    };

    const renderFooter = () => {
        const message = messages[messages.length - 1];

        if (!message.isWriting && message.answer) {
            switch(message.answer.type) {
                case 'variants':
                    return (
                        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" fullWidth>
                            {message.answer.value ? message.answer.value.map(answer => {
                                return (
                                    <Button key={answer.message} fullWidth onClick={() => { sendMessage(answer.message) }}>{answer.message}</Button>
                                );
                            }) : null}
                        </ButtonGroup>
                    );
                case 'password':
                    return (
                        <>
                            <Input
                                placeholder={message.answer.placeholder}
                                className={styles.input}
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                }} />
                            <Fab size="small" color="primary">
                                <Icon onClick={() => {
                                    if (inputValue.toLowerCase() === message.answer.value.toLowerCase()) {
                                        sendMessage(message.answer.value);
                                    } else {
                                        alert('Пароль не верный');
                                    }
                                }}>send</Icon>
                            </Fab>
                        </>
                    );
                default:
                    return null;
            }
        }
    };

    return messages ? (
        <div className={styles['container']}>
            <div className={styles['header']}>Чат</div>
            <div className={styles['message-list-container']}>{renderMessages()}</div>
            <div className={styles['footer']}>
                {renderFooter()}
            </div>
        </div>
    ) : (
        <div />
    );
}

export default Messenger;
