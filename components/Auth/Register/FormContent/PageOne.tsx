import type { RegisterPageState } from '@/redux/registerPage/reducer';
import type { State } from '@/redux/store';

import { setEmail, setPassword, setConfirmPassword, setUsername } from '@/redux/registerPage/actions';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';

const PageOne: React.FC = () => {
    const { email, password, confirmPassword, username } = useSelector<State, RegisterPageState>(
        state => state.registerPage
    );

    const dispatch = useDispatch();

    return (
        <>
            <TextField
                required
                value={username}
                onChange={ev => dispatch(setUsername(ev.target.value))}
                type="text"
                fullWidth
                color="primary"
                label="Username"
                error={!username.match(/^[a-z]{1,32}$/g)}
                helperText={
                    username.match(/^[a-z]{1,32}$/g)
                        ? ''
                        : 'Username must be 32 characters long. Only lowercase letters allowed'
                }
            />
            <TextField
                required
                value={email}
                onChange={ev => dispatch(setEmail(ev.target.value))}
                type="text"
                fullWidth
                color="primary"
                label="Email Address"
            />
            <TextField
                required
                value={password}
                onChange={ev => dispatch(setPassword(ev.target.value))}
                type="password"
                fullWidth
                color="primary"
                label="Password"
            />
            <TextField
                required
                value={confirmPassword}
                onChange={ev => dispatch(setConfirmPassword(ev.target.value))}
                error={confirmPassword !== password}
                helperText={confirmPassword !== password ? 'The passwords do not match' : ''}
                type="password"
                fullWidth
                color="primary"
                label="Confirm Password"
            />
            {/* TODO: Add captcha */}
        </>
    );
};

export default PageOne;
