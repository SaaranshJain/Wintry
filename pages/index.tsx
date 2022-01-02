import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';
import type { NextPage } from 'next';
import type { Socket } from 'socket.io-client';
import type { MessageInterface } from './api/get-friend-messages';

import { setModalState } from '@/redux/homePage/actions';
import { Toolbar, Box, useMediaQuery, CssBaseline, SpeedDialAction, SpeedDialIcon, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PeopleAlt, PersonAdd, Send } from '@mui/icons-material';
import { InputPaper, StyledSpeedDial, TextFieldInput } from '@/components/Home/helpers';
import { aspectRatioMediaQuery } from '@/components/helpers';

import React from 'react';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import Navbar from '@/components/Home/Navbar';
import dynamic from 'next/dynamic';
import io from 'socket.io-client';
import MessagesList from '@/components/Home/MessageList';
import Head from 'next/head';

const AddFriendModal = dynamic(() => import('@/components/Home/Modals/AddFriendModal'));
const CreateRoomModal = dynamic(() => import('@/components/Home/Modals/CreateRoomModal'));

let socket: Socket;

const Home: NextPage = () => {
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);

    const dispatch = useDispatch();
    const { loading } = useSelector<State, HomePageState>(state => state.homePage);

    const [messages, setMessages] = React.useState<MessageInterface[]>([]);
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        socket = io('http://localhost:3000', {
            path: '/api/socket',
        });

        socket.on('connect', () => {});

        socket.on('receiveMessage', (msg: string) => {
            setMessages(msgs => [...msgs, { displayName: 'tinmanfall', pfp: '', content: msg }]);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    return (
        <>
            <Head>
                <title>Omnipresent</title>
            </Head>
            <AddFriendModal />
            <CreateRoomModal />
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
                                        ev.preventDefault();
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
