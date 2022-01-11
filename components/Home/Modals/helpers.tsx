import {
    Box,
    BoxProps,
    Button,
    ButtonProps,
    Modal,
    ModalProps,
    styled,
    Typography,
    TypographyProps,
} from '@mui/material';

export const AddFriendModalOutline = styled(Modal)<ModalProps>(() => {
    return {
        position: 'fixed',
        left: '30vw',
        right: '30vw',
        top: '30vh',
        bottom: '30vh',
        backgroundColor: '#353535',
        padding: '2.5rem',
        borderRadius: '15px',
        minWidth: 240,
    };
});

export const CreateRoomModalOutline = styled(Modal)<ModalProps>(() => {
    return {
        position: 'fixed',
        left: '30vw',
        right: '30vw',
        top: '15vh',
        bottom: '15vh',
        backgroundColor: '#353535',
        padding: '2.5rem',
        borderRadius: '15px',
        minWidth: 240,
    };
});

export const InviteModalOutline = styled(Modal)<ModalProps>(() => {
    return {
        position: 'fixed',
        left: '30vw',
        right: '30vw',
        top: '15vh',
        bottom: '15vh',
        backgroundColor: '#353535',
        padding: '2.5rem',
        borderRadius: '15px',
        minWidth: 240,
    };
});

export const GridBox = styled(Box)<BoxProps>(() => {
    return { display: 'grid' };
});

export const ModalTitle = styled(Typography)<TypographyProps<'h6'>>(() => {
    return { textAlign: 'center', marginBottom: '1rem' };
});

export const ModalDescription = styled(Typography)<TypographyProps<'p'>>(() => {
    return { textAlign: 'center', marginBottom: '1rem' };
});

export const SendButton = styled(Button)<ButtonProps>(() => {
    return { placeSelf: 'center', marginTop: '3rem' };
});
