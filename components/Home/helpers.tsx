import { Paper, PaperProps, SpeedDial, SpeedDialProps, styled, TextField, TextFieldProps } from '@mui/material';

export const InputPaper = styled(Paper)<PaperProps>(() => {
    return {
        display: 'grid',
        gridTemplateColumns: '20fr 1fr',
        position: 'fixed',
        bottom: '1rem',
        left: '108px',
        right: '272px',
    };
});

export const TextFieldInput = styled(TextField)<TextFieldProps>(() => {
    return {
        backgroundColor: '#353535',
        borderRadius: '15px',
        ['& fieldset']: { borderRadius: '15px' },
    };
});

export const StyledSpeedDial = styled(SpeedDial)<SpeedDialProps>(() => {
    return { position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1201 };
});
