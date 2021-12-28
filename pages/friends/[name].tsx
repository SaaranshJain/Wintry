import type { GetServerSideProps, NextPage } from 'next';
import type { State } from '@/redux/store';
import type { HomePageState } from '@/redux/homePage/reducer';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setModalState } from '@/redux/homePage/actions';
import { Send, PeopleAlt, PersonAdd } from '@mui/icons-material';
import { InputPaper, TextFieldInput, StyledSpeedDial } from '@/components/Home/helpers';
import { Box, CssBaseline, Toolbar, IconButton, SpeedDialIcon, SpeedDialAction, useMediaQuery } from '@mui/material';
import { aspectRatioMediaQuery } from '@/components/helpers';
import { MessageInterface, OutgoingDataGetFriendMessages } from '../api/get-friend-messages';

import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import RightDrawer from '@/components/Home/Drawers/RightDrawer';
import MessagesList from '@/components/Home/MessageList';
import AddFriendModal from '@/components/Home/Modals/AddFriendModal';
import Navbar from '@/components/Home/Navbar';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const FriendChat: NextPage<{ friend?: string }> = ({ friend }) => {
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);

    const { loading, username } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();
    const router = useRouter();

    const [messages, setMessages] = React.useState<MessageInterface[]>([]);
    const [id, setID] = React.useState('');
    const [message, setMessage] = React.useState('');

    React.useEffect(() => {
        if (!friend) {
            router.push('/');
        }

        axios
            .post<OutgoingDataGetFriendMessages>('/api/get-friend-messages', { friend, username })
            .then(res => {
                setMessages(res.data.messages);
                setID(res.data.roomID);
            })
            .catch(console.log);
    }, [router]);

    React.useEffect(() => {
        socket = io('http://localhost:3000', {
            path: '/api/socket',
        });

        socket.on('connect', () => {
            console.log('Joining...');
            socket.emit('join', id);
        });

        socket.on('receiveMessage', (msg: MessageInterface) => {
            setMessages(msgs => [...msgs, msg]);
        });

        console.log(socket);

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [id]);

    return (
        <>
            <Head>
                <title>{friend}</title>
            </Head>
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
                                        ev.preventDefault();
                                        socket.emit('sendMessage', message, id);
                                        setMessage('');
                                    }
                                }}
                            />
                            <IconButton
                                disableRipple
                                onClick={() => {
                                    socket.emit('sendMessage', message, id);
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

export const getServerSideProps: GetServerSideProps = async ({ query: { name } }) => {
    if (!name || Array.isArray(name)) {
        return { redirect: { destination: '/', statusCode: 400 }, props: {} };
    }

    return {
        props: {
            friend: name,
        },
    };
};

export default FriendChat;
