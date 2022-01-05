import { aspectRatioMediaQuery } from '@/components/helpers';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import RightDrawer from '@/components/Home/Drawers/RightDrawer';
import HomeSpeedDial from '@/components/Home/HomeSpeedDial';
import MessageInputBox from '@/components/Home/MessageInputBox';
import MessagesList from '@/components/Home/MessageList';
import Navbar from '@/components/Home/Navbar';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { MessageInterface } from '../api/get-friend-messages';
import { OutgoingDataGetRoomMessages } from '../api/get-room-messages';

const AddFriendModal = dynamic(() => import('@/components/Home/Modals/AddFriendModal'));
const CreateRoomModal = dynamic(() => import('@/components/Home/Modals/CreateRoomModal'));

let socket: Socket;

const RoomChat: NextPage<{ roomNumber?: string }> = ({ roomNumber }) => {
    const roomNumberInt = parseInt(roomNumber ?? '0');
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);
    const { username } = useSelector<State, HomePageState>(state => state.homePage);
    const [messages, setMessages] = React.useState<MessageInterface[]>([]);
    const [room, setRoom] = React.useState('');

    const router = useRouter();

    React.useEffect(() => {
        if (!roomNumber) {
            router.push('/');
            return;
        }

        axios
            .post<OutgoingDataGetRoomMessages>('/api/get-room-messages', { username, roomNumber: roomNumberInt })
            .then(res => {
                setMessages(res.data.messages);
                setRoom(res.data.room);
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
            socket.emit('join', roomNumberInt);
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
                <title>{room}</title>
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
                    <MessageInputBox roomNumber={roomNumberInt} socket={socket} />
                    <RightDrawer currentChat={roomNumber} widthMatch={widthMatch} />
                    <HomeSpeedDial />
                </Box>
            </Box>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ query: { roomNumber } }) => {
    if (!roomNumber || Array.isArray(roomNumber)) {
        return { redirect: { destination: '/', statusCode: 400 }, props: {} };
    }

    return {
        props: {
            roomNumber,
        },
    };
};

export default RoomChat;
