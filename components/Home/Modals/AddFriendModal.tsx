import { OutgoingDataGetUsers } from '@/pages/api/get-users';
import { setModalState } from '@/redux/homePage/actions';
import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import { Autocomplete, Box, Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
        <Modal
            sx={{
                position: 'fixed',
                left: '30vw',
                right: '30vw',
                top: '30vh',
                bottom: '30vh',
                backgroundColor: '#353535',
                padding: '2.5rem',
                borderRadius: '15px',
                minWidth: 240,
            }}
            open={modalState === 'add-friend'}
            onClose={() => dispatch(setModalState('closed'))}
        >
            <Box sx={{ display: 'grid' }}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', mb: 3 }}>
                    Add a friend
                </Typography>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    ref={autocompleteRef}
                    onInputChange={(ev, value) => setFriendUsername(value)}
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
                <Button
                    onClick={async () => {
                        const res = await axios.post('/api/send-friend-request', {
                            currentUser: id,
                            targetUser: friendUsername,
                        });
                    }}
                    variant="outlined"
                    sx={{ placeSelf: 'center', mt: 5 }}
                >
                    Send!
                </Button>
            </Box>
        </Modal>
    );
};

export default AddFriendModal;
