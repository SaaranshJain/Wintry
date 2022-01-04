import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';

import { aspectRatioMediaQuery } from '@/components/helpers';
import { closeLeftDrawer, openLeftDrawer, closeRightDrawer, openRightDrawer } from '@/redux/homePage/actions';
import { People, Menu } from '@mui/icons-material';
import { Toolbar, IconButton, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ElevatedAppbar } from './helpers';

import React from 'react';

const Navbar: React.FC = () => {
    const { leftDrawerOpen, rightDrawerOpen } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    const widthMatch = useMediaQuery(aspectRatioMediaQuery);

    return (
        <ElevatedAppbar position="fixed">
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
                        onClick={() => (rightDrawerOpen ? dispatch(closeRightDrawer()) : dispatch(openRightDrawer()))}
                    >
                        <People />
                    </IconButton>
                )}
            </Toolbar>
        </ElevatedAppbar>
    );
};

export default Navbar;
