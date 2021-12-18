import { PaperPropsWithComponent } from '@/helpers';
import { Paper, styled } from '@mui/material';

export const FooterPaperLogin = styled(Paper)<PaperPropsWithComponent<'form'>>(() => {
    return {
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        boxShadow: 'none',
    };
});
