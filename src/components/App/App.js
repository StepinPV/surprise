import React, {useEffect, useState} from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Messenger from '../Messenger/Messenger';
import Finish from '../Finish/Finish';
import Loader from '../Loader/Loader';
import styles from './App.module.css';
import axios from "axios";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1e88e5',
        },
        secondary: {
            main: '#1e88e5',
        },
    },
});

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fixedLoading, setFixedLoading] = useState(false);

    const getData = async () => {
        const { data } = await axios.get('/api/load-data');
        setData(data);
    };

    const sendMessage = async message => {
        const { data } = await axios.get('/api/send-message', {
            params: {
                message,
                timestamp: Date.now()
            }
        });

        setData(data);
    };

    const startFixedLoading = () => {
        setFixedLoading(true);

        setTimeout(() => {
            setFixedLoading(false);
        }, 4000);
    };

    useEffect(() => {
        (async function fetchData() {
            startFixedLoading();
            setLoading(true);
            await getData();
            setLoading(false);
        })();
    },[]);

    const renderPage = () => {
        if (loading || fixedLoading) {
            return <Loader message='Я рад тебя здесь видеть, Настя!' />;
        }

        const activeStep = data.steps[data.data.activeStep];

        switch(activeStep.type) {
            case 'question':
                if (activeStep.time && activeStep.time > (new Date()).getTime()) {
                    const targetDate = new Date(parseInt(activeStep.time));
                    return <Loader hasProgress={false} message={
                        `Настя, я жду тебя здесь
                        ${targetDate.toLocaleString('ru', { day: 'numeric', month: 'long' })}
                        в ${targetDate.toLocaleString('ru', { hour: 'numeric', minute: 'numeric' })} :)`} />
                }
                return <Messenger data={data} sendMessage={sendMessage} />;
            case 'finish':
                return <Finish />;
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div className={styles.container}>
                { renderPage() }
            </div>
        </ThemeProvider>
    );
}

export default App;
