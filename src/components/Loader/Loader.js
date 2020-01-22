import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import styles from './Loader.module.css';
import img1 from './nastya.jpg';
import img2 from './vera.jpg';

const getImage = () => {
    if (window) {
        switch(window.location.host){
            case 'xn------7cdbghkzjfdotwjwcbcubmilgu73aib.xn--p1ai': return img1;
            case 'xn------ddddkjcaljblou5brcsbidh6w9b8a.xn--p1ai': return img2;
            default: return img1;
        }
    }

    return img1;
};

function Loader({ message, hasProgress = true }) {
    return (
        <div className={styles['container']}>
            <div className={styles['photo-container']}>
                <img src={getImage()} className={styles.photo} />
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
