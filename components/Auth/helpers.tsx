import { PaperPropsWithComponent } from '@/helpers';
import { OutgoingDataVerify } from '@/pages/api/verify';
import { setID, setChats, setEmail, setUsername, setLoadingFalse, setLoadingTrue } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Paper, styled } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ContainerSection = styled(Paper)<PaperPropsWithComponent<'section'>>(() => {
    return { width: '100%', height: '100%', display: 'grid', placeItems: 'center' };
});

export const FormPaper = styled(Paper)<PaperPropsWithComponent<'form'>>(() => {
    return {
        width: '75%',
        height: '75%',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
    };
});

export const InnerSectionPaper = styled(Paper)<PaperPropsWithComponent<'section'>>(() => {
    return {
        margin: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        boxShadow: 'none',
    };
});

export const FooterPaper = styled(Paper)<PaperPropsWithComponent<'form'>>(() => {
    return {
        marginTop: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        boxShadow: 'none',
    };
});

const AuthMiddleware: React.FC = ({ children }) => {
    const router = useRouter();
    const { loading } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setLoadingTrue());
        const token = localStorage.getItem('token');

        if (router.asPath === '/login' || router.asPath === '/register') {
            if (token) {
                router.push('/');
            }

            return;
        }

        if (!token) {
            router.push('/login');
            return;
        }

        axios
            .post<OutgoingDataVerify>('/api/verify', { token })
            .then(res => {
                if (res.data.verified) {
                    const { email, id, username, chats } = res.data;

                    dispatch(setEmail(email));
                    dispatch(setID(id));
                    dispatch(setUsername(username));
                    dispatch(setChats(chats));
                    dispatch(setLoadingFalse());
                    return;
                }

                throw 'Not verified';
            })
            .catch(() => {
                localStorage.removeItem('token');
                router.push('/login');
            });
    }, [router, dispatch]);

    return loading ? <div></div> : <>{children}</>;
};

export default AuthMiddleware;
