import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';
import type { Option, OutgoingDataGetUsers } from '@/pages/api/get-users';

import { setModalState } from '@/redux/homePage/actions';
import { Autocomplete, Avatar, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AddFriendModalOutline, GridBox, ModalDescription, ModalTitle, SendButton } from './helpers';

import axios from 'axios';
import React from 'react';

const AddFriendModal: React.FC = () => {
    const { username, modalState } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    const [friendUsername, setFriendUsername] = React.useState('');
    const [options, setOptions] = React.useState<Option[]>([]);

    return (
        <AddFriendModalOutline open={modalState === 'add-friend'} onClose={() => dispatch(setModalState('closed'))}>
            <GridBox>
                <ModalTitle id="modal-title" variant="h6">
                    Add a friend
                </ModalTitle>
                <ModalDescription id="modal-desc" variant="body1">
                    Press <kbd>Enter</kbd> to search for user to send friend request to
                </ModalDescription>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    onInputChange={(_, value) => setFriendUsername(value)}
                    renderOption={(props, option) => (
                        <ListItem alignItems="flex-start" {...props}>
                            <ListItemAvatar>
                                <Avatar src={option.pfp}>
                                    {option.label
                                        .split(' ')
                                        .reduce((a, v) => a + v[0], '')
                                        .slice(0, 2)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>{option.label}</ListItemText>
                        </ListItem>
                    )}
                    renderInput={params => (
                        <TextField
                            {...params}
                            value={friendUsername}
                            fullWidth
                            onKeyPress={async ev => {
                                if (ev.key === 'Enter') {
                                    axios
                                        .post<OutgoingDataGetUsers>('/api/get-users', {
                                            friendUsername,
                                            username,
                                        })
                                        .then(res => {
                                            setOptions(res.data.options);
                                        })
                                        .catch(() => {
                                            setOptions([]);
                                        });
                                }
                            }}
                            label="Username"
                        />
                    )}
                />
                <SendButton
                    onClick={() => {
                        axios
                            .post('/api/send-friend-request', {
                                currentUser: username,
                                targetUser: friendUsername,
                            })
                            .finally(() => {
                                dispatch(setModalState('closed'));
                            });
                    }}
                    variant="outlined"
                >
                    Send!
                </SendButton>
            </GridBox>
        </AddFriendModalOutline>
    );
};

export default AddFriendModal;
