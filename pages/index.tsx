import type { NextPage } from 'next';
import type { Socket } from 'socket.io-client';
import type { MessageInterface } from './api/get-friend-messages';

import { Toolbar, Box, useMediaQuery, CssBaseline } from '@mui/material';
import { aspectRatioMediaQuery } from '@/components/helpers';

import React from 'react';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import Navbar from '@/components/Home/Navbar';
import dynamic from 'next/dynamic';
import io from 'socket.io-client';
import MessagesList from '@/components/Home/MessageList';
import Head from 'next/head';
import HomeSpeedDial from '@/components/Home/HomeSpeedDial';
import MessageInputBox from '@/components/Home/MessageInputBox';

const AddFriendModal = dynamic(() => import('@/components/Home/Modals/AddFriendModal'));
const CreateRoomModal = dynamic(() => import('@/components/Home/Modals/CreateRoomModal'));

let socket: Socket;

const Home: NextPage = () => {
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);
    const [messages, setMessages] = React.useState<MessageInterface[]>([]);

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
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                <LeftDrawer widthMatch={widthMatch} />
                <Box component="main" sx={{ width: '100%' }}>
                    <Toolbar />
                    <MessagesList messages={messages} />
                    <MessageInputBox socket={socket} />
                    <HomeSpeedDial />
                </Box>
            </Box>
        </>
    );
};

export default Home;
