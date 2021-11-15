import { clearPfp, setAbout, setPfp, setUsername } from '@/redux/registerPage/actions';
import { RegisterPageState } from '@/redux/registerPage/reducer';
import { Close, AccountCircle } from '@mui/icons-material';
import { Avatar, Badge, IconButton, TextField, Tooltip, Zoom } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '@/styles/Register.module.scss';
import { State } from '@/redux/store';

const PfpWithRemoveButton: React.FC = () => {
    const dispatch = useDispatch();
    const { pfp } = useSelector<State, RegisterPageState>(state => state.registerPage);

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <IconButton onClick={() => setTimeout(() => dispatch(clearPfp()), 100)}>
                    <Close />
                </IconButton>
            }
        >
            <Avatar src={URL.createObjectURL(pfp)} />
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
            <AccountCircle></AccountCircle>
            <input accept="image/*" type="file" hidden onChange={handleChange} />
        </>
    );
};

const PageTwo: React.FC = () => {
    const { about, pfp, username } = useSelector<State, RegisterPageState>(state => state.registerPage);
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
                <label style={{ cursor: pfp ? undefined : 'pointer' }} className={styles['profile-label']}>
                    {pfp ? <PfpWithRemoveButton /> : <PfpInput />}
                </label>
            </Tooltip>

            <TextField
                required
                value={username}
                onChange={ev => dispatch(setUsername(ev.target.value))}
                type="text"
                fullWidth
                color="primary"
                label="Username"
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
                // TODO: Fix max lines
            />
        </>
    );
};

export default PageTwo;
