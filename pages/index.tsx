import { setEmail, setChats, setID, setUsername, setLoadingTrue, setLoadingFalse, setModalState } from '@/redux/homePage/actions';
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
import { PeopleAlt, PersonAdd } from '@mui/icons-material';
import AddFriendModal from '@/components/Home/Modals/AddFriendModal';

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { currentChat, loading, modalState } = useSelector<State, HomePageState>(state => state.homePage);
    const widthMatch = useMediaQuery(
        json2mq({
            minAspectRatio: '1/1',
        })
    );

    const [messages, setMessages] = React.useState<Message[]>([]);

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
                        <RightDrawer widthMatch={widthMatch} />
                        <SpeedDial
                            ariaLabel="Add new"
                            sx={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1201 }}
                            color="primary"
                            icon={<SpeedDialIcon />}
                        >
                            <SpeedDialAction
                                onClick={() => router.push('/create')}
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
