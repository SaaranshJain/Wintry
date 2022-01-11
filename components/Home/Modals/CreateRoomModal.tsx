import type { HomePageState } from '@/redux/homePage/reducer';
import type { State } from '@/redux/store';
import type { OutgoingDataCreateRoom } from '@/pages/api/create-room';

import {
    RemovePfpIconButton,
    StyledAccountCircle,
    StyledCloseIcon,
    UserAvatar,
} from '@/components/Auth/Register/helpers';
import { setModalState } from '@/redux/homePage/actions';
import { Badge, TextField, Tooltip, Zoom } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CreateRoomModalOutline, GridBox, ModalDescription, ModalTitle, SendButton } from './helpers';

import axios from 'axios';
import React from 'react';

interface PfpProps {
    setPfp: React.Dispatch<React.SetStateAction<File | null>>;
}

type PfpPropsWithRemove = PfpProps & { pfp: File | null };

const PfpWithRemoveButton: React.FC<PfpPropsWithRemove> = ({ pfp, setPfp }) => {
    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <RemovePfpIconButton onClick={() => setTimeout(() => setPfp(null), 100)}>
                    <StyledCloseIcon />
                </RemovePfpIconButton>
            }
        >
            <UserAvatar src={pfp ? URL.createObjectURL(pfp) : undefined} />
        </Badge>
    );
};

const PfpInput: React.FC<PfpProps> = ({ setPfp }) => {
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (!ev.target.files || !ev.target.files[0]) {
            return setPfp(null);
        }

        const file = ev.target.files[0];
        setPfp(file);
    };

    return (
        <>
            <StyledAccountCircle />
            <input
                accept="image/*"
                type="file"
                hidden
                onChange={handleChange}
                style={{ width: '10rem', height: '10rem', color: '#353535' }}
            />
        </>
    );
};

const CreateRoomModal: React.FC = () => {
    const { modalState, username } = useSelector<State, HomePageState>(state => state.homePage);
    const dispatch = useDispatch();

    const [roomname, setRoomName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [currentLength, setCurrentLength] = React.useState(0);
    const [pfp, setPfp] = React.useState<File | null>(null);

    return (
        <CreateRoomModalOutline open={modalState === 'create-room'} onClose={() => dispatch(setModalState('closed'))}>
            <GridBox sx={{ placeItems: 'center' }}>
                <ModalTitle variant="h6">
                    Create a room
                </ModalTitle>
                <ModalDescription variant='body1' color="ActiveCaption">
                    Create a room to hang out with your homies!
                </ModalDescription>
                <Tooltip
                    TransitionComponent={Zoom}
                    sx={{ display: 'grid', placeItems: 'center' }}
                    title={pfp ? 'Profile picture' : 'Select an image'}
                    placement="left"
                    arrow
                >
                    <label
                        style={{
                            cursor: pfp ? undefined : 'pointer',
                            width: '10rem',
                            height: '10rem',
                            marginBottom: '1rem',
                        }}
                    >
                        {pfp ? <PfpWithRemoveButton pfp={pfp} setPfp={setPfp} /> : <PfpInput setPfp={setPfp} />}
                    </label>
                </Tooltip>
                <TextField
                    sx={{ marginBottom: '1rem' }}
                    fullWidth
                    label="Room name"
                    value={roomname}
                    onChange={ev => setRoomName(ev.target.value)}
                />
                <TextField
                    value={description}
                    onChange={ev => {
                        setCurrentLength(ev.target.value.length);
                        setDescription(ev.target.value);
                    }}
                    type="text"
                    fullWidth
                    color="primary"
                    label="Description"
                    multiline
                    inputProps={{ maxLength: 200 }}
                    helperText={`${currentLength} of 200`}
                    error={currentLength > 200}
                    maxRows={3}
                />
                <SendButton
                    sx={{ position: 'absolute', bottom: '2rem' }}
                    variant="outlined"
                    onClick={async () => {
                        const body = new FormData();
                        pfp ? body.append('pfp', pfp) : null;
                        body.append('roomname', roomname);
                        body.append('description', description);
                        body.append('username', username);

                        axios.post<OutgoingDataCreateRoom>('/api/create-room', body).finally(() => {
                            dispatch(setModalState('closed'));
                        });
                    }}
                >
                    Create!
                </SendButton>
            </GridBox>
        </CreateRoomModalOutline>
    );
};

export default CreateRoomModal;
