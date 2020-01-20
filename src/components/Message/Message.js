import React, {useEffect, useState} from 'react';
import styles from './Message.module.css';

export default function Message({ message, isMine, startsSequence, endsSequence, showTimestamp, isWriting, timestamp }) {
    const [finalMessage, setFinalMessages] = useState(isWriting ? '.' : message);

    useEffect(() => {
        setTimeout(() => {
            if (isWriting) {
                switch (finalMessage) {
                    case '.': setFinalMessages('..'); break;
                    case '..': setFinalMessages('...'); break;
                    case '...': setFinalMessages('.'); break;
                    default: setFinalMessages('.'); break;
                }
            } else {
                setFinalMessages(message);
            }
        }, 350);
    },[isWriting, finalMessage]);

    const renderMessage = () => {
        if (finalMessage.type) {
            switch(finalMessage.type) {
                case 'image':
                    return <img src={finalMessage.value} className={styles.img} />
            }
        }

        return finalMessage;
    };

    return (
        <div className={[
            styles['message'],
            `${isMine ? styles['mine'] : ''}`,
            `${startsSequence ? styles['start'] : ''}`,
            `${endsSequence ? styles['end'] : ''}`
        ].join(' ')}>
            {
                showTimestamp && timestamp &&
                <div className={styles['timestamp']}>
                    { new Date(parseInt(timestamp)).toLocaleString('ru', { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' }) }
                </div>
            }

            <div className={styles['bubble-container']}>
                <div className={styles['bubble']}>
                    { renderMessage() }
                </div>
            </div>
        </div>
    );
}
