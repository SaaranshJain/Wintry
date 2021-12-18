import { IconButton, IconButtonProps, styled } from '@mui/material';

export const DialogIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => {
    return { position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] };
});
