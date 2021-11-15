import { setEmail, setID, setUsername } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OutgoingDataVerify } from './api/verify';

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { email, id, username } = useSelector<State, HomePageState>(state => state.homePage);

    React.useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        axios.post<OutgoingDataVerify>('/api/verify', { token }).then(res => {
            if (res.data.verified) {
                const { email, id, username } = res.data;

                dispatch(setEmail(email));
                dispatch(setID(id));
                return dispatch(setUsername(username));
            }

            localStorage.removeItem('token');
            router.push('/login');
        });
    }, [dispatch, router]);

    return (
        <section>
            {[email, id, username].map((v, i) => (
                <p key={i}>{v}</p>
            ))}
        </section>
    );
};

export default Home;
