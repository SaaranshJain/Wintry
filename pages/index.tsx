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
import {
    Toolbar,
    Box,
    List,
    ListItem,
    useMediaQuery,
    Divider,
    Avatar,
    CssBaseline,
    ListItemAvatar,
    ListItemText,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Input,
    TextField,
    Paper,
    IconButton,
} from '@mui/material';
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
        !loading
            ? axios
                  .post<OutgoingDataGetMessages>('/api/get-messages', { id: currentChat })
                  .then(res => setMessages(res.data.messages))
            : null;
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
                        <List
                            sx={{
                                width: `calc(100% - 72px${widthMatch ? ' - 240px' : ''})`,
                                bgcolor: 'background.paper',
                            }}
                        >
                            {messages.map(msg => (
                                <>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar src={msg.pfp}>
                                                {msg.author
                                                    .split(' ')
                                                    .reduce((a, v) => a + v[0], '')
                                                    .slice(0, 2)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={msg.author} secondary={msg.content} />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </>
                            ))}
                        </List>
                        <Paper
                            elevation={0}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '20fr 1fr',
                                position: 'fixed',
                                bottom: '1rem',
                                left: '108px',
                                right: '272px',
                            }}
                        >
                            <TextField
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
                                sx={{
                                    backgroundColor: '#353535',
                                    borderRadius: '15px',
                                    ['& fieldset']: { borderRadius: '15px' },
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
                        </Paper>
                        <RightDrawer widthMatch={widthMatch} />
                        <SpeedDial
                            ariaLabel="Add new"
                            sx={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1201 }}
                            color="primary"
                            icon={<SpeedDialIcon />}
                        >
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
                        </SpeedDial>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Home;
