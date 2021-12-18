import { hideDialog } from '@/redux/registerPage/actions';
import { RegisterPageState } from '@/redux/registerPage/reducer';
import { State } from '@/redux/store';
import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, IconButton, DialogContent, DialogContentText } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogIconButton } from './helpers';

const RegisterPageDialog: React.FC = () => {
    const { dialogOpen, dialogMsg } = useSelector<State, RegisterPageState>(state => state.registerPage);
    const dispatch = useDispatch();

    if (dialogOpen) {
        return (
            <Dialog open>
                <DialogTitle>
                    Error
                    <DialogIconButton onClick={() => dispatch(hideDialog())}>
                        <Close />
                    </DialogIconButton>
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
