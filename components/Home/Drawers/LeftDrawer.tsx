import { closeLeftDrawer, openLeftDrawer, setCurrentChat } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Toolbar, Box, List, ListItem, Divider, SwipeableDrawer, Tooltip } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LeftDrawerOutline, ListIconWithMinWidth, StyledAvatarLeftDrawer, StyledLeftDrawerListItem } from './helpers';

const LeftDrawerListItem: React.FC<{ name: string; chatId: string }> = ({ name, chatId, children }) => {
    const { currentChat } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    const switchChat = (chatId: string) => {
        dispatch(setCurrentChat(chatId));
    };

    return (
        <Tooltip title={name} placement="right">
            <StyledLeftDrawerListItem
                disableRipple
                onClick={() => switchChat(chatId)}
                disabled={currentChat === chatId}
                style={{ opacity: 1 }}
                selected={currentChat === chatId}
            >
                {children}
            </StyledLeftDrawerListItem>
        </Tooltip>
    );
};

const LeftDrawerContent: React.FC = () => {
    const { chats } = useSelector<State, HomePageState>(state => state.homePage);

    return (
        <>
            <Toolbar />
            <Box>
                <List>
                    <LeftDrawerListItem name="Omnipresent" chatId="omnipresent">
                        <ListIconWithMinWidth>
                            <StyledAvatarLeftDrawer pfp src="/media/assets/Omnipresent.png" alt="Omnipresent" />
                        </ListIconWithMinWidth>
                    </LeftDrawerListItem>
                </List>
                <Divider />
                <List>
                    {chats[0]?.map(friend => (
                        <LeftDrawerListItem key={friend.id} name={friend.name} chatId={friend.id}>
                            <ListIconWithMinWidth>
                                <StyledAvatarLeftDrawer
                                    pfp={!!friend.pfp}
                                    src={friend.pfp || undefined}
                                    alt={friend.name}
                                />
                            </ListIconWithMinWidth>
                        </LeftDrawerListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {chats[1]?.map(room => (
                        <LeftDrawerListItem key={room.id} name={room.name} chatId={room.id}>
                            <ListIconWithMinWidth>
                                <StyledAvatarLeftDrawer pfp={!!room.pfp} src={room.pfp || undefined} alt={room.name} />
                            </ListIconWithMinWidth>
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
        <LeftDrawerOutline variant="permanent" PaperProps={{ elevation: 1 }}>
            <LeftDrawerContent />
        </LeftDrawerOutline>
    );
};

export default LeftDrawer;
