import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';
import type { NextPage } from 'next';
import type { Socket } from 'socket.io-client';
import type { OutgoingDataVerify } from './api/verify';
import type { Message, OutgoingDataGetMessages } from './api/get-messages';

import {
    setEmail,
    setChats,
    setID,
    setUsername,
    setLoadingTrue,
    setLoadingFalse,
    setModalState,
} from '@/redux/homePage/actions';
import { Toolbar, Box, useMediaQuery, CssBaseline, SpeedDialAction, SpeedDialIcon, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { PeopleAlt, PersonAdd, Send } from '@mui/icons-material';
import { InputPaper, StyledSpeedDial, TextFieldInput } from '@/components/Home/helpers';
import { aspectRatioMediaQuery } from '@/components/helpers';

import axios from 'axios';
import React from 'react';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import RightDrawer from '@/components/Home/Drawers/RightDrawer';
import Navbar from '@/components/Home/Navbar';
import dynamic from 'next/dynamic';
import io from 'socket.io-client';
import MessagesList from '@/components/Home/MessageList';

const AddFriendModal = dynamic(() => import('@/components/Home/Modals/AddFriendModal'));

const Home: NextPage = () => {
    let socket: Socket;

    const router = useRouter();
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);
    
    const dispatch = useDispatch();
    const { loading } = useSelector<State, HomePageState>(state => state.homePage);

    const [messages, setMessages] = React.useState<Message[]>([]);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        dispatch(setLoadingTrue());
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        axios.post<OutgoingDataVerify>('/api/verify', { token }).then(res => {
            if (res.data.verified) {
                const { email, id, username, chats } = res.data;

                dispatch(setEmail(email));
                dispatch(setID(id));
                dispatch(setUsername(username));
                dispatch(setChats(chats));
                dispatch(setLoadingFalse());
                return;
            }

            throw "Not verified";
        }).catch(() => {
            localStorage.removeItem('token');
            router.push('/login');
        });
    }, [dispatch, router]);

    React.useEffect(() => {
        if (!loading) {
            socket = io('http://localhost:3000', {
                path: '/api/socket',
            });

            socket.on('connect', () => {});

            socket.on('receiveMessage', (msg: string) => {
                setMessages(msgs => [...msgs, { author: 'tinmanfall', pfp: '', content: msg }]);
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [loading]);

    return (
        <>
            <AddFriendModal />
            {!loading && (
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <Navbar />
                    <LeftDrawer widthMatch={widthMatch} />
                    <Box component="main" sx={{ width: '100%' }}>
                        <Toolbar />
                        <MessagesList messages={messages} />
                        <InputPaper elevation={0}>
                            <TextFieldInput
                                multiline
                                autoFocus
                                maxRows={5}
                                value={message}
                                onChange={ev => setMessage(ev.target.value)}
                                onKeyDown={ev => {
                                    if (ev.key === 'Enter' && !ev.shiftKey) {
                                        socket.emit('sendMessage', message);
                                        setMessage('');
                                    }
                                }}
                                />
                            <IconButton
                                disableRipple
                                onClick={() => {
                                    socket.emit('sendMessage', message);
                                    setMessage('');
                                }}
                            >
                                <Send />
                            </IconButton>
                        </InputPaper>
                        <RightDrawer widthMatch={widthMatch} />
                        <StyledSpeedDial ariaLabel="Add new" color="primary" icon={<SpeedDialIcon />}>
                            <SpeedDialAction
                                onClick={() => dispatch(setModalState('create-room'))}
                                key="create room"
                                icon={<PeopleAlt />}
                                tooltipTitle="Create a room"
                            />
                            <SpeedDialAction
                                onClick={() => dispatch(setModalState('add-friend'))}
                                key="add friend"
                                icon={<PersonAdd />}
                                tooltipTitle="Add a friend"
                            />
                        </StyledSpeedDial>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Home;
