import { AppBar, AppBarProps, styled } from '@mui/material';

export const ElevatedAppbar = styled(AppBar)<AppBarProps>(({ theme }) => {
    return { zIndex: theme.zIndex.drawer + 1 };
});
