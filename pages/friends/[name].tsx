import type { GetServerSideProps, NextPage } from 'next';
import type { State } from '@/redux/store';
import type { HomePageState } from '@/redux/homePage/reducer';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import { aspectRatioMediaQuery } from '@/components/helpers';
import { MessageInterface, OutgoingDataGetFriendMessages } from '../api/get-friend-messages';

import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import MessagesList from '@/components/Home/MessageList';
import Navbar from '@/components/Home/Navbar';
import io, { Socket } from 'socket.io-client';
import HomeSpeedDial from '@/components/Home/HomeSpeedDial';
import MessageInputBox from '@/components/Home/MessageInputBox';
import dynamic from 'next/dynamic';

const AddFriendModal = dynamic(() => import('@/components/Home/Modals/AddFriendModal'));
const CreateRoomModal = dynamic(() => import('@/components/Home/Modals/CreateRoomModal'));

let socket: Socket;

const FriendChat: NextPage<{ friend?: string }> = ({ friend }) => {
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);

    const { username } = useSelector<State, HomePageState>(state => state.homePage);
    const router = useRouter();

    const [messages, setMessages] = React.useState<MessageInterface[]>([]);
    const [roomNumber, setRoomNumber] = React.useState(0);

    React.useEffect(() => {
        if (!friend) {
            router.push('/');
        }

        axios
            .post<OutgoingDataGetFriendMessages>('/api/get-friend-messages', { friend, username })
            .then(res => {
                setMessages(res.data.messages);
                setRoomNumber(res.data.roomNumber);
            })
            .catch(() => {
                router.push('/');
            });
    }, [router]);

    React.useEffect(() => {
        socket = io('http://localhost:3000', {
            path: '/api/socket',
        });

        socket.on('connect', () => {
            socket.emit('join', roomNumber);
        });

        socket.on('receiveMessage', (msg: MessageInterface) => {
            setMessages(msgs => [...msgs, msg]);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [roomNumber]);

    return (
        <>
            <Head>
                <title>{friend}</title>
            </Head>
            <AddFriendModal />
            <CreateRoomModal />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <LeftDrawer widthMatch={widthMatch} />
                <Box component="main" sx={{ width: '100%' }}>
                    <Toolbar />
                    <MessagesList messages={messages} />
                    <MessageInputBox socket={socket} roomNumber={roomNumber} />
                    <HomeSpeedDial />
                </Box>
            </Box>
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
