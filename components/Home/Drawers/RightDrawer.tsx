import { closeRightDrawer, openRightDrawer } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { ExpandMore } from '@mui/icons-material';
import {
    Toolbar,
    SwipeableDrawer,
    Drawer,
    Accordion,
    AccordionSummary,
    Typography,
    AccordionDetails,
    List,
    ListItem,
    Avatar,
    ListItemAvatar,
    ListItemText,
    Badge,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Member, OutgoingDataRoomUsers } from '@/pages/api/room-users';

const RightDrawerContent: React.FC = () => {
    const { currentChat } = useSelector<State, HomePageState>(state => state.homePage);
    const [members, setMembers] = React.useState<Member[]>([]);

    React.useEffect(() => {
        axios.post<OutgoingDataRoomUsers>('/api/room-users', { roomID: currentChat }).then(res => {
            setMembers(res.data.members);
        });
    }, [currentChat]);

    return (
        <>
            <Toolbar />
            <Accordion sx={{ width: 240 }} elevation={3} disableGutters>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>Online</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: '0.5rem' }}>
                    <List>
                        {members.map(member => (
                            <ListItem
                                key={member.id}
                                button
                                sx={{
                                    borderRadius: '15px',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginBottom: '0.5rem',
                                    [':hover']: { backgroundColor: theme => theme.palette.primary.dark },
                                }}
                            >
                                <ListItemAvatar>
                                    <Badge
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        color="secondary"
                                        overlap="circular"
                                    >
                                        <Avatar
                                            src={member.pfp}
                                            sx={
                                                member.pfp
                                                    ? {}
                                                    : { backgroundColor: theme => theme.palette.primary.light }
                                            }
                                        >
                                            {member.name
                                                .split(' ')
                                                .reduce((a, v) => a + v[0], '')
                                                .slice(0, 2)}
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText primary={member.name} />
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
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
        <Drawer
            variant="permanent"
            sx={{ width: '72', [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' } }}
            PaperProps={{ elevation: 1 }}
            anchor="right"
        >
            <RightDrawerContent />
        </Drawer>
    );
};

export default RightDrawer;
