import { aspectRatioMediaQuery } from '@/components/helpers';
import { Close } from '@mui/icons-material';
import {
    Dialog,
    DialogContent,
    DialogContentText,
    Slide,
    useMediaQuery,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Snackbar,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import React from 'react';

const Transition = React.forwardRef(
    (
        props: TransitionProps & {
            children: React.ReactElement;
        },
        ref: React.Ref<unknown>
    ) => <Slide direction="up" ref={ref} {...props} />
);

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

interface PageDialogProps {
    dialogOpen: boolean;
    dialogMsg: string;
    handleClose: () => any;
}

const PageDialog: React.FC<PageDialogProps> = ({ dialogOpen, dialogMsg, handleClose }) => {
    const widthMatch = useMediaQuery(aspectRatioMediaQuery);

    return !widthMatch ? (
        <Dialog open={dialogOpen} fullScreen TransitionComponent={Transition} onClose={handleClose}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <Close />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Error
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <DialogContentText>{dialogMsg}</DialogContentText>
            </DialogContent>
        </Dialog>
    ) : (
        <Snackbar open={dialogOpen} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {dialogMsg}
            </Alert>
        </Snackbar>
    );
};

export default PageDialog;
