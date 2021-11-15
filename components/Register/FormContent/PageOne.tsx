import { setEmail, setPassword, setConfirmPassword } from '@/redux/registerPage/actions';
import { RegisterPageState } from '@/redux/registerPage/reducer';
import { State } from '@/redux/store';
import { TextField } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PageOne: React.FC = () => {
    const { email, password, confirmPassword } = useSelector<State, RegisterPageState>(state => state.registerPage);
    const dispatch = useDispatch();

    return (
        <>
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
