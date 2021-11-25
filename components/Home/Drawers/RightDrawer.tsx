import { closeDrawer, openDrawer } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Toolbar, Box, List, ListItem, ListItemIcon, Avatar, Divider, SwipeableDrawer, Drawer } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RightDrawerContent: React.FC = () => (
    <>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem button>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                        <Avatar alt="Saaransh Jain" />
                    </ListItemIcon>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                        <Avatar alt="Saaransh Jain" />
                    </ListItemIcon>
                </ListItem>
            </List>
        </Box>
    </>
);

const RightDrawer: React.FC<{ widthMatch: boolean }> = ({ widthMatch }) => {
    const { drawerOpen } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    if (!widthMatch) {
        return (
            <SwipeableDrawer
                PaperProps={{ elevation: 1 }}
                open={drawerOpen}
                onClose={() => dispatch(closeDrawer())}
                onOpen={() => dispatch(openDrawer())}
                anchor="right"
            >
                <RightDrawerContent />
            </SwipeableDrawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{ width: 72, [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' } }}
            PaperProps={{ elevation: 1 }}
            anchor="right"
        >
            <RightDrawerContent />
        </Drawer>
    );
};

export default RightDrawer;
