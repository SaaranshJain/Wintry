import type { RegisterPageState } from '@/redux/registerPage/reducer';
import type { State } from '@/redux/store';

import { setAbout, setDisplayName, setPfp } from '@/redux/registerPage/actions';
import { TextField, Tooltip, Zoom } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PfpWithRemoveButton, PfpInput } from '@/components/PfpInput';

import React from 'react';

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
                    {pfp ? (
                        <PfpWithRemoveButton pfp={pfp} setPfp={pfp => dispatch(setPfp(pfp))} />
                    ) : (
                        <PfpInput setPfp={pfp => dispatch(setPfp(pfp))} />
                    )}
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
