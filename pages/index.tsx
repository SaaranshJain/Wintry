import { closeDrawer, openDrawer, setEmail, setID, setUsername } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
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
import { Menu } from '@mui/icons-material';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OutgoingDataVerify } from './api/verify';
import json2mq from 'json2mq';
import LeftDrawer from '@/components/Home/Drawers/LeftDrawer';
import RightDrawer from '@/components/Home/Drawers/RightDrawer';

const Home: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { drawerOpen } = useSelector<State, HomePageState>(state => state.homePage);
    const widthMatch = useMediaQuery(
        json2mq({
            minAspectRatio: '1/1',
        })
    );

    React.useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            router.push('/login');
            return;
        }

        axios.post<OutgoingDataVerify>('/api/verify', { token }).then(res => {
            if (res.data.verified) {
                const { email, id, username } = res.data;

                dispatch(setEmail(email));
                dispatch(setID(id));
                dispatch(setUsername(username));
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
                            aria-label="open drawer"
                            edge="start"
                            sx={{ mr: 2 }}
                            onClick={() => (drawerOpen ? dispatch(closeDrawer()) : dispatch(openDrawer()))}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div">
                        Omnipresent
                    </Typography>
                </Toolbar>
            </AppBar>
            <LeftDrawer widthMatch={widthMatch} />
            <Box component="main" sx={{ width: '100%' }}>
                <Toolbar />
                <List sx={{ width: `calc(100% - 72px${widthMatch ? ' - 10vh' : ''})`, bgcolor: 'background.paper' }}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt="Remy Sharp" />
                        </ListItemAvatar>
                        <ListItemText
                            primary="Brunch this weekend?"
                            secondary={
                                <>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Ali Connors
                                    </Typography>
                                    {" — I'll be in your neighborhood doing errands this…"}
                                </>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </List>
                <RightDrawer widthMatch={widthMatch} />
            </Box>
        </Box>
    );
};

export default Home;
