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
import { purple } from '@mui/material/colors';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LeftDrawerContent: React.FC = () => {
    const { chats, currentChat } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    return (
        <>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    <Tooltip title="Omnipresent" placement="right">
                        <ListItem
                            button
                            onClick={() => dispatch(setCurrentChat('omnipresent'))}
                            disabled={currentChat === 'omnipresent'}
                            style={{ opacity: 1 }}
                            sx={
                                currentChat === 'omnipresent'
                                    ? {
                                          backgroundColor: theme => theme.palette.action.selected,
                                      }
                                    : {}
                            }
                        >
                            <ListItemIcon sx={{ minWidth: 0 }}>
                                <Avatar
                                    style={{ outline: `2px solid ${purple[500]}` }}
                                    src="/media/pfp/Omnipresent.png"
                                    alt="Omnipresent"
                                />
                            </ListItemIcon>
                        </ListItem>
                    </Tooltip>
                </List>
                <Divider />
                <List>
                    {chats[0]?.map(friend => (
                        <Tooltip title={friend.name} placement="right">
                            <ListItem
                                button
                                onClick={() => dispatch(setCurrentChat(friend.id))}
                                disabled={currentChat === friend.id}
                                style={{ opacity: 1 }}
                                sx={
                                    currentChat === friend.id
                                        ? {
                                              backgroundColor: theme => theme.palette.action.selected,
                                          }
                                        : {}
                                }
                                key={friend.id}
                            >
                                <ListItemIcon sx={{ minWidth: 0 }}>
                                    <Avatar
                                        style={
                                            friend.pfp
                                                ? { outline: `2px solid ${purple[500]}` }
                                                : { backgroundColor: purple[500] }
                                        }
                                        src={friend.pfp || undefined}
                                        alt={friend.name}
                                    />
                                </ListItemIcon>
                            </ListItem>
                        </Tooltip>
                    ))}
                </List>
                <Divider />
                <List>
                    {chats[1]?.map(room => (
                        <Tooltip title={room.name} placement="right">
                            <ListItem
                                button
                                onClick={() => dispatch(setCurrentChat(room.id))}
                                disabled={currentChat === room.id}
                                style={{ opacity: 1 }}
                                sx={
                                    currentChat === room.id
                                        ? {
                                              backgroundColor: theme => theme.palette.action.selected,
                                          }
                                        : {}
                                }
                                key={room.id}
                            >
                                <ListItemIcon sx={{ minWidth: 0 }}>
                                    <Avatar
                                        style={
                                            room.pfp
                                                ? { outline: `2px solid ${purple[500]}` }
                                                : { backgroundColor: purple[500] }
                                        }
                                        src={room.pfp || undefined}
                                        alt={room.name}
                                    />
                                </ListItemIcon>
                            </ListItem>
                        </Tooltip>
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
