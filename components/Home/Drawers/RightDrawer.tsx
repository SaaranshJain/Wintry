import { closeRightDrawer, openRightDrawer } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
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
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Member, OutgoingDataRoomUsers } from '@/pages/api/room-users';
import {
    AccordionListItem,
    FullWidthAccordion,
    PaddedAccordionDetails,
    RightDrawerOutline,
    StyledAvatarRightDrawer,
} from './helpers';

const RightDrawerContent: React.FC = () => {
    const { currentChat, loading } = useSelector<State, HomePageState>(state => state.homePage);
    const [members, setMembers] = React.useState<Member[]>([]);

    React.useEffect(() => {
        if (!loading) {
            axios.post<OutgoingDataRoomUsers>('/api/room-users', { roomID: currentChat }).then(res => {
                setMembers(res.data.members);
            });
        }
    }, [currentChat, loading]);

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

const RightDrawer: React.FC<{ widthMatch: boolean }> = ({ widthMatch }) => {
    const { rightDrawerOpen } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    if (!widthMatch) {
        return (
            <SwipeableDrawer
                PaperProps={{ elevation: 1 }}
                open={rightDrawerOpen}
                onClose={() => dispatch(closeRightDrawer())}
                onOpen={() => dispatch(openRightDrawer())}
                anchor="right"
            >
                <RightDrawerContent />
            </SwipeableDrawer>
        );
    }

    return (
        <RightDrawerOutline variant="permanent" PaperProps={{ elevation: 1 }} anchor="right">
            <RightDrawerContent />
        </RightDrawerOutline>
    );
};

export default RightDrawer;
