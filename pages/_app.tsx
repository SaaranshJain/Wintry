import type { AppProps } from 'next/app';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';

import theme from '@/theme';
import store from '@/redux/store';
import AuthMiddleware from '@/components/Auth/helpers';
import Head from 'next/head';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <CssBaseline />
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <Provider store={store}>
                    <AuthMiddleware>
                        <Component {...pageProps} />
                    </AuthMiddleware>
                </Provider>
            </ThemeProvider>
        </>
    );
}

export default MyApp;
