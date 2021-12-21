import { AccountCircle, Close } from '@mui/icons-material';
import { Avatar, AvatarProps, IconButton, IconButtonProps, styled } from '@mui/material';

export const RemovePfpIconButton = styled(IconButton)<IconButtonProps>(() => {
    return {
        background: '#353535',
        ['&:hover']: { background: '#353535' },
    };
});

export const StyledCloseIcon = styled(Close)(() => {
    return { color: 'white', width: '2rem', height: '2rem' };
});

export const UserAvatar = styled(Avatar)<AvatarProps>(() => {
    return { width: '10rem', height: '10rem' };
});

export const StyledAccountCircle = styled(AccountCircle)(() => {
    return { width: '10rem', height: '10rem', color: '#353535' };
});
