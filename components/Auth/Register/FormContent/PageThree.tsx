import { clearPfp, setAbout, setDisplayName, setPfp } from '@/redux/registerPage/actions';
import { RegisterPageState } from '@/redux/registerPage/reducer';
import { Badge, TextField, Tooltip, Zoom } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '@/redux/store';
import { RemovePfpIconButton, StyledAccountCircle, StyledCloseIcon, UserAvatar } from '../helpers';

import React from 'react';

const PfpWithRemoveButton: React.FC = () => {
    const dispatch = useDispatch();
    const { pfp } = useSelector<State, RegisterPageState>(state => state.registerPage);

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <RemovePfpIconButton onClick={() => setTimeout(() => dispatch(clearPfp()), 100)}>
                    <StyledCloseIcon />
                </RemovePfpIconButton>
            }
        >
            <UserAvatar src={pfp ? URL.createObjectURL(pfp) : undefined} />
        </Badge>
    );
};

const PfpInput: React.FC = () => {
    const dispatch = useDispatch();

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (!ev.target.files || !ev.target.files[0]) {
            return dispatch(clearPfp());
        }

        const file = ev.target.files[0];
        dispatch(setPfp(file));
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

const PageThree: React.FC = () => {
    const { about, displayName, pfp } = useSelector<State, RegisterPageState>(state => state.registerPage);
    const dispatch = useDispatch();
    const [currentLength, setCurrentLength] = React.useState(0);

    return (
        <>
            <Tooltip
                TransitionComponent={Zoom}
                title={pfp ? 'Profile picture' : 'Select an image'}
                placement="left"
                arrow
            >
                <label
                    style={{
                        cursor: pfp ? undefined : 'pointer',
                        width: '10rem',
                        height: '10rem',
                        alignSelf: 'center',
                    }}
                >
                    {pfp ? <PfpWithRemoveButton /> : <PfpInput />}
                </label>
            </Tooltip>

            <TextField
                required
                value={displayName}
                onChange={ev => dispatch(setDisplayName(ev.target.value))}
                type="text"
                fullWidth
                color="primary"
                label="Display Name"
            />
            <TextField
                value={about}
                onChange={ev => {
                    setCurrentLength(ev.target.value.length);
                    dispatch(setAbout(ev.target.value));
                }}
                type="text"
                fullWidth
                color="primary"
                label="About"
                multiline
                inputProps={{ maxLength: 200 }}
                helperText={`${currentLength} of 200`}
                error={currentLength > 200}
                maxRows={2}
            />
        </>
    );
};

export default PageThree;
