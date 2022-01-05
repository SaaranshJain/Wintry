import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';
import type { Member, OutgoingDataRoomUsers } from '@/pages/api/room-users';

import { closeRightDrawer, openRightDrawer } from '@/redux/homePage/actions';
import { ExpandMore } from '@mui/icons-material';
import {
    Toolbar,
    SwipeableDrawer,
    AccordionSummary,
    Typography,
    List,
    ListItemAvatar,
    ListItemText,
    Badge,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    AccordionListItem,
    FullWidthAccordion,
    PaddedAccordionDetails,
    RightDrawerOutline,
    StyledAvatarRightDrawer,
} from './helpers';

import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/router';

const RightDrawerContent: React.FC<{ currentChat: string }> = ({ currentChat }) => {
    const { loading } = useSelector<State, HomePageState>(state => state.homePage);
    const [members, setMembers] = React.useState<Member[]>([]);
    const router = useRouter();

    React.useEffect(() => {
        if (!loading) {
            axios
                .post<OutgoingDataRoomUsers>('/api/room-users', { roomNumber: currentChat })
                .then(res => {
                    setMembers(res.data.members);
                })
                .catch(() => {
                    router.push('/');
                });
        }
    }, [currentChat, loading, router]);

    return (
        <>
            <Toolbar />
            <FullWidthAccordion elevation={3} disableGutters>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>{currentChat === 'omnipresent' ? 'Commands' : 'Online'}</Typography>
                </AccordionSummary>
                <PaddedAccordionDetails>
                    <List>
                        {members.map(member => (
                            <AccordionListItem key={member.id}>
                                <ListItemAvatar>
                                    <Badge
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color="secondary"
                                        overlap="circular"
                                    >
                                        <StyledAvatarRightDrawer src={member.pfp} pfp={!!member.pfp}>
                                            {member.name
                                                .split(' ')
                                                .reduce((a, v) => a + v[0], '')
                                                .slice(0, 2)}
                                        </StyledAvatarRightDrawer>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText primary={member.name} />
                            </AccordionListItem>
                        ))}
                    </List>
                </PaddedAccordionDetails>
            </FullWidthAccordion>
        </>
    );
};

interface RightDrawerProps {
    widthMatch: boolean;
    currentChat?: string;
}

const RightDrawer: React.FC<RightDrawerProps> = ({ currentChat, widthMatch }) => {
    const { rightDrawerOpen } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    if (!currentChat) {
        return <></>;
    }

    if (!widthMatch) {
        return (
            <SwipeableDrawer
                PaperProps={{ elevation: 1 }}
                open={rightDrawerOpen}
                onClose={() => dispatch(closeRightDrawer())}
                onOpen={() => dispatch(openRightDrawer())}
                anchor="right"
            >
                <RightDrawerContent currentChat={currentChat} />
            </SwipeableDrawer>
        );
    }

    return (
        <RightDrawerOutline variant="permanent" PaperProps={{ elevation: 1 }} anchor="right">
            <RightDrawerContent currentChat={currentChat} />
        </RightDrawerOutline>
    );
};

export default RightDrawer;
