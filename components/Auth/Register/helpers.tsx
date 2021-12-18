import { PaperPropsWithComponent } from '@/helpers';
import { Paper, styled } from '@mui/material';

export const FooterPaperRegister = styled(Paper)<PaperPropsWithComponent<'form'>>(() => {
    return {
        marginTop: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        boxShadow: 'none',
    };
});
