import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';

import { closeLeftDrawer, openLeftDrawer, setModalState } from '@/redux/homePage/actions';
import {
    Toolbar,
    Box,
    List,
    Divider,
    SwipeableDrawer,
    Tooltip,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Menu,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LeftDrawerOutline, ListIconWithMinWidth, StyledAvatarLeftDrawer, StyledLeftDrawerListItem } from './helpers';
import { Upload } from '@mui/icons-material';

import React from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { OutgoingDataCreateInvite } from '@/pages/api/create-invite';

const InviteModal = dynamic(() => import('../Modals/InviteModal'));

interface Anchor {
    el: HTMLElement;
    roomNumber: number;
}

const LeftDrawerContent: React.FC = () => {
    const {
        chats: { friends, rooms },
    } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    const router = useRouter();

    const [anchor, setAnchor] = React.useState<Anchor | null>(null);
    const [invite, setInvite] = React.useState('');

    return (
        <>
            <InviteModal invite={invite} />
            <Toolbar />
            <Menu sx={{ padding: '0' }} anchorEl={anchor?.el} open={!!anchor} onClose={() => setAnchor(null)}>
                <MenuList sx={{ padding: '0' }}>
                    <MenuItem
                        onClick={() => {
                            axios
                                .post<OutgoingDataCreateInvite>('/api/create-invite', {
                                    roomNumber: anchor?.roomNumber,
                                })
                                .then(res => {
                                    setInvite(res.data.invite);
                                    dispatch(setModalState('invite'));
                                })
                                .catch(() => {});
                        }}
                    >
                        <ListItemIcon>
                            <Upload fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Send Invite</ListItemText>
                    </MenuItem>
                </MenuList>
            </Menu>
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
                {friends.length > 0 && (
                    <>
                        <List>
                            {friends.map((friend, index) => (
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
                    </>
                )}
                {rooms.length > 0 && (
                    <List>
                        {rooms.map((room, index) => (
                            <Tooltip key={index} title={room.name} placement="right">
                                <StyledLeftDrawerListItem
                                    disableRipple
                                    style={{ opacity: 1 }}
                                    selected={router.asPath === `/rooms/${room.roomNumber}`}
                                    onClick={() =>
                                        router.asPath !== `/rooms/${room.roomNumber}` &&
                                        router.push(`/rooms/${room.roomNumber}`)
                                    }
                                    onContextMenu={ev => {
                                        ev.preventDefault();
                                        setAnchor({ el: ev.currentTarget, roomNumber: room.roomNumber });
                                    }}
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
                )}
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
