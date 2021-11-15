import '../styles/globals.scss';
import type { AppProps } from 'next/app';

import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';
import { Provider } from 'react-redux';
import store from '@/redux/store';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <CssBaseline />
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>
            </ThemeProvider>
        </>
    );
}

export default MyApp;
