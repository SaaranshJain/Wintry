import { setCode } from '@/redux/registerPage/actions';
import { RegisterPageState } from '@/redux/registerPage/reducer';
import { State } from '@/redux/store';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import React from 'react';

const PageTwo: React.FC = () => {
    const { code } = useSelector<State, RegisterPageState>(state => state.registerPage);
    const dispatch = useDispatch();

    return (
        <>
            <TextField
                required
                value={code}
                onChange={ev => dispatch(setCode(ev.target.value))}
                type="text"
                fullWidth
                color="primary"
                label="OTP"
            />
        </>
    );
};

export default PageTwo;
