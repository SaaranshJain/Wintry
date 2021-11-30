import { closeLeftDrawer, openLeftDrawer, setCurrentChat } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import {
    Toolbar,
    Box,
    List,
    ListItem,
    ListItemIcon,
    Avatar,
    Divider,
    SwipeableDrawer,
    Drawer,
    Tooltip,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LeftDrawerListItem: React.FC<{ name: string; chatId: string }> = ({ name, chatId, children }) => {
    const { currentChat } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    const switchChat = (chatId: string) => {
        dispatch(setCurrentChat(chatId));
    };

    return (
        <Tooltip title={name} placement="right">
            <ListItem
                button
                disableRipple
                onClick={() => switchChat(chatId)}
                disabled={currentChat === chatId}
                style={{ opacity: 1 }}
                sx={
                    currentChat === chatId
                        ? {
                              backgroundColor: theme => theme.palette.action.selected,
                          }
                        : {}
                }
            >
                {children}
            </ListItem>
        </Tooltip>
    );
};

const LeftDrawerContent: React.FC = () => {
    const { chats } = useSelector<State, HomePageState>(state => state.homePage);

    return (
        <>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <LeftDrawerListItem name="Omnipresent" chatId="omnipresent">
                        <ListItemIcon sx={{ minWidth: 0 }}>
                            <Avatar
                                sx={{ outline: theme => `2px solid ${theme.palette.primary.main}` }}
                                src="/media/pfp/Omnipresent.png"
                                alt="Omnipresent"
                            />
                        </ListItemIcon>
                    </LeftDrawerListItem>
                </List>
                <Divider />
                <List>
                    {chats[0]?.map(friend => (
                        <LeftDrawerListItem key={friend.id} name={friend.name} chatId={friend.id}>
                            <ListItemIcon sx={{ minWidth: 0 }}>
                                <Avatar
                                    sx={
                                        friend.pfp
                                            ? { outline: theme => `2px solid ${theme.palette.primary.main}` }
                                            : { backgroundColor: theme => theme.palette.primary.main }
                                    }
                                    src={friend.pfp || undefined}
                                    alt={friend.name}
                                />
                            </ListItemIcon>
                        </LeftDrawerListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {chats[1]?.map(room => (
                        <LeftDrawerListItem key={room.id} name={room.name} chatId={room.id}>
                            <ListItemIcon sx={{ minWidth: 0 }}>
                                <Avatar
                                    sx={
                                        room.pfp
                                            ? { outline: theme => `2px solid ${theme.palette.primary.main}` }
                                            : { backgroundColor: theme => theme.palette.primary.main }
                                    }
                                    src={room.pfp || undefined}
                                    alt={room.name}
                                />
                            </ListItemIcon>
                        </LeftDrawerListItem>
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
