import { OutgoingDataGetUsers } from '@/pages/api/get-users';
import { setModalState } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddFriendModalOutline, GridBox, ModalTitle, SendButton } from './helpers';

interface Option {
    label: string;
}

const AddFriendModal: React.FC = () => {
    const { id, modalState } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    const [friendUsername, setFriendUsername] = React.useState('');
    const [options, setOptions] = React.useState<Option[]>([]);
    const autocompleteRef = React.useRef<any>();

    return (
        <AddFriendModalOutline open={modalState === 'add-friend'} onClose={() => dispatch(setModalState('closed'))}>
            <GridBox>
                <ModalTitle id="modal-modal-title" variant="h6">
                    Add a friend
                </ModalTitle>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    ref={autocompleteRef}
                    onInputChange={(_, value) => setFriendUsername(value)}
                    renderInput={params => (
                        <TextField
                            {...params}
                            value={friendUsername}
                            fullWidth
                            onKeyPress={async ev => {
                                if (ev.key === 'Enter') {
                                    const res = await axios.post<OutgoingDataGetUsers>('/api/get-users', {
                                        username: friendUsername,
                                    });
                                    setOptions(res.data.options);
                                    console.log(options);
                                }
                            }}
                            label="Username"
                        />
                    )}
                />
                <SendButton
                    onClick={async () => {
                        const res = await axios.post('/api/send-friend-request', {
                            currentUser: id,
                            targetUser: friendUsername,
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
