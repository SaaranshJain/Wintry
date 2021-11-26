import { closeLeftDrawer, openLeftDrawer } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Toolbar, Box, List, ListItem, ListItemIcon, Avatar, Divider, SwipeableDrawer, Drawer } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LeftDrawerContent: React.FC = () => {
    const { chats } = useSelector<State, HomePageState>(state => state.homePage);

    return (
        <>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <ListItem button>
                        <ListItemIcon sx={{ minWidth: 0 }}>
                            <Avatar src="/media/pfp/Omnipresent.png" alt="Omnipresent" />
                        </ListItemIcon>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {chats[0]?.map(friend => (
                        <ListItem button key={friend.id}>
                            <ListItemIcon sx={{ minWidth: 0 }}>
                                <Avatar src={friend.pfp || undefined} alt={friend.name} />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {chats[1]?.map(room => (
                        <ListItem button key={room.id}>
                            <ListItemIcon sx={{ minWidth: 0 }}>
                                <Avatar src={room.pfp || undefined} alt={room.name} />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </>
    );
};

const LeftDrawer: React.FC<{ widthMatch: boolean }> = ({ widthMatch }) => {
    const { leftDrawerOpen } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    if (!widthMatch) {
        return (
            <SwipeableDrawer
                PaperProps={{ elevation: 1 }}
                open={leftDrawerOpen}
                onClose={() => dispatch(closeLeftDrawer())}
                onOpen={() => dispatch(openLeftDrawer())}
            >
                <LeftDrawerContent />
            </SwipeableDrawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{ width: 72, [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' } }}
            PaperProps={{ elevation: 1 }}
        >
            <LeftDrawerContent />
        </Drawer>
    );
};

export default LeftDrawer;
