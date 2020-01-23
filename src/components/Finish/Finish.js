import React, {useState, useEffect} from 'react';
import styles from './Finish.module.css';
import image from './image.jpg';

function Finish({ }) {
    const [time, setTime] = useState(6000);

    useEffect( () => {
        if (time > 0) {
            setTimeout(() => {
                setTime(time - 1);
            }, 10);
        }
    },[time]);

    const minutes = Math.floor(time/100);
    const secs = time%100;

    return (
        <div className={styles['container']}>
            <div className={styles['photo-container']}>
                <div className={styles.message}>
                    Открывай дверь!)
                </div>
                <img src={image} className={styles.image}/>
                <div className={styles.timer}>
                    {`${minutes < 10 ? '0' : ''}${Math.floor(time/100)}:${time%100}${secs < 10 ? '0' : ''}`}
                </div>
            </div>
        </div>
    );
}

export default Finish;
