import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import styles from './Loader.module.css';
import photo from './photo.jpg';

function Loader({ message, hasProgress = true }) {
    return (
        <div className={styles['container']}>
            <div className={styles['photo-container']}>
                <img src={photo} className={styles.photo} />
                <div className={styles.text}>
                    {message}
                </div>
                {hasProgress ? (
                    <div className={styles['progress']}>
                        <LinearProgress />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default Loader;
