import {
    setEmail,
    setChats,
    setID,
    setUsername,
    setLoadingTrue,
    setLoadingFalse,
    setModalState,
} from '@/redux/homePage/actions';
import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';
import { Toolbar, Box, useMediaQuery, CssBaseline, SpeedDialAction, SpeedDialIcon, IconButton } from '@mui/material';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { OutgoingDataVerify } from './api/verify';
import json2mq from 'json2mq';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import RightDrawer from '@/components/Home/Drawers/RightDrawer';
import { Message, OutgoingDataGetMessages } from './api/get-messages';
import Navbar from '@/components/Home/Navbar';
import { PeopleAlt, PersonAdd, Send } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import io, { Socket } from 'socket.io-client';
import MessagesList from '@/components/Home/MessageList';
import { InputPaper, StyledSpeedDial, TextFieldInput } from '@/components/Home/helpers';

const AddFriendModal = dynamic(() => import('@/components/Home/Modals/AddFriendModal'));

const sendMessage = (socket: Socket, msg: string) => {
    socket.emit('sendMessage', msg);
};

let socket: Socket;

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentChat, loading } = useSelector<State, HomePageState>(state => state.homePage);
    const widthMatch = useMediaQuery(
        json2mq({
            minAspectRatio: '1/1',
        })
    );

    const [messages, setMessages] = React.useState<Message[]>([]);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        if (!loading) {
            socket = io('http://localhost:3000', {
                path: '/api/socket',
            });

            // log socket connection
            socket.on('connect', () => {
                socket.emit('sendMessage', 'henlo');
            });

            // update chat on new message dispatched
            socket.on('receiveMessage', (message: string) => {
                setMessages(msgs => [...msgs, { author: 'tinmanfall', pfp: '', content: message }]);
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
        }
    }, [loading]);

    React.useEffect(() => {
        if (!loading) {
            axios
                .post<OutgoingDataGetMessages>('/api/get-messages', { id: currentChat })
                .then(res => setMessages(res.data.messages));
        }
    }, [currentChat, loading]);

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

            localStorage.removeItem('token');
            router.push('/login');
        });
    }, [dispatch, router]);

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
                                        sendMessage(socket, message);
                                        setMessage('');
                                    }
                                }}
                            />
                            <IconButton
                                disableRipple
                                onClick={() => {
                                    sendMessage(socket, message);
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
