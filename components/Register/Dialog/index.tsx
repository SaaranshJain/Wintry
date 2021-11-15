import { hideDialog } from '@/redux/registerPage/actions';
import { RegisterPageState } from '@/redux/registerPage/reducer';
import { State } from '@/redux/store';
import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, DialogContent, DialogContentText } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RegisterPageDialog: React.FC = () => {
    const { dialogOpen, dialogMsg } = useSelector<State, RegisterPageState>(state => state.registerPage);
    const dispatch = useDispatch();

    if (dialogOpen) {
        return (
            <Dialog open>
                <DialogTitle>
                    Error
                    <IconButton
                        onClick={() => dispatch(hideDialog())}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: theme => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
            </Dialog>
        );
    }

    return null;
};

export default RegisterPageDialog;
