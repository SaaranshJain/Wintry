import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';

import { closeLeftDrawer, openLeftDrawer } from '@/redux/homePage/actions';
import { Toolbar, Box, List, Divider, SwipeableDrawer, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LeftDrawerOutline, ListIconWithMinWidth, StyledAvatarLeftDrawer, StyledLeftDrawerListItem } from './helpers';

import React from 'react';

const LeftDrawerContent: React.FC = () => {
    const { chats } = useSelector<State, HomePageState>(state => state.homePage);
    const router = useRouter();

    return (
        <>
            <Toolbar />
            <Box>
                <List>
                    <Tooltip title="Omnipresent" placement="right">
                        <StyledLeftDrawerListItem
                            disableRipple
                            disabled={router.pathname === '/'}
                            style={{ opacity: 1 }}
                            selected={router.pathname === '/'}
                        >
                            <ListIconWithMinWidth>
                                <StyledAvatarLeftDrawer pfp src="/media/assets/Omnipresent.png" alt="Omnipresent" />
                            </ListIconWithMinWidth>
                        </StyledLeftDrawerListItem>
                    </Tooltip>
                </List>
                <Divider />
                <List>
                    {chats.friends.map((friend, index) => (
                        <Tooltip key={index} title={friend.name} placement="right">
                            <StyledLeftDrawerListItem
                                disableRipple
                                disabled={router.asPath === `/friends/${friend.name}`}
                                style={{ opacity: 1 }}
                                selected={router.asPath === `/friends/${friend.name}`}
                                onClick={() => router.push(`/friends/${friend.name}`)}
                            >
                                <ListIconWithMinWidth>
                                    <StyledAvatarLeftDrawer
                                        pfp={!!friend.pfp}
                                        src={friend.pfp || undefined}
                                        alt={friend.name}
                                    />
                                </ListIconWithMinWidth>
                            </StyledLeftDrawerListItem>
                        </Tooltip>
                    ))}
                </List>
                <Divider />
                <List>
                    {chats.rooms.map((room, index) => (
                        <Tooltip key={index} title={room.name} placement="right">
                            <StyledLeftDrawerListItem
                                disableRipple
                                disabled={router.asPath === `/rooms/${room.room_number}`}
                                style={{ opacity: 1 }}
                                selected={router.asPath === `/rooms/${room.room_number}`}
                                onClick={() => router.push(`/rooms/${room.room_number}`)}
                            >
                                <ListIconWithMinWidth>
                                    <StyledAvatarLeftDrawer
                                        pfp={!!room.pfp}
                                        src={room.pfp || undefined}
                                        alt={room.name}
                                    />
                                </ListIconWithMinWidth>
                            </StyledLeftDrawerListItem>
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
        <LeftDrawerOutline variant="permanent" PaperProps={{ elevation: 1 }}>
            <LeftDrawerContent />
        </LeftDrawerOutline>
    );
};

export default LeftDrawer;
