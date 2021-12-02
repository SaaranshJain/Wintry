import {
    closeLeftDrawer,
    openLeftDrawer,
    setEmail,
    setChats,
    setID,
    setUsername,
    closeRightDrawer,
    openRightDrawer,
} from '@/redux/homePage/actions';
import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    List,
    ListItem,
    useMediaQuery,
    Divider,
    IconButton,
    Avatar,
    CssBaseline,
    ListItemAvatar,
    ListItemText,
} from '@mui/material';
import { Menu, People } from '@mui/icons-material';
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

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { leftDrawerOpen, rightDrawerOpen, currentChat } = useSelector<State, HomePageState>(state => state.homePage);
    const widthMatch = useMediaQuery(
        json2mq({
            minAspectRatio: '1/1',
        })
    );

    const [messages, setMessages] = React.useState<Message[]>([]);

    React.useEffect(() => {
        axios
            .post<OutgoingDataGetMessages>('/api/get-messages', { id: currentChat })
            .then(res => setMessages(res.data.messages));
    }, [currentChat]);

    React.useEffect(() => {
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
                return;
            }

            localStorage.removeItem('token');
            router.push('/login');
        });
    }, [dispatch, router]);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    {!widthMatch && (
                        <IconButton
                            color="inherit"
                            aria-label="open left drawer"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => (leftDrawerOpen ? dispatch(closeLeftDrawer()) : dispatch(openLeftDrawer()))}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Omnipresent
                    </Typography>
                    {!widthMatch && (
                        <IconButton
                            color="inherit"
                            aria-label="open right drawer"
                            // sx={{ position: 'absolute', right: '1rem' }}
                            onClick={() =>
                                rightDrawerOpen ? dispatch(closeRightDrawer()) : dispatch(openRightDrawer())
                            }
                        >
                            <People />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <LeftDrawer widthMatch={widthMatch} />
            <Box component="main" sx={{ width: '100%' }}>
                <Toolbar />
                <List sx={{ width: `calc(100% - 72px${widthMatch ? ' - 240px' : ''})`, bgcolor: 'background.paper' }}>
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
            </Box>
        </Box>
    );
};

export default Home;
