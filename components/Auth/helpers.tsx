import { PaperPropsWithComponent } from '@/helpers';
import { Paper, styled } from '@mui/material';

export const ContainerSection = styled(Paper)<PaperPropsWithComponent<'section'>>(() => {
    return { width: '100%', height: '100%', display: 'grid', placeItems: 'center' };
});

export const FormPaper = styled(Paper)<PaperPropsWithComponent<'form'>>(() => {
    return {
        width: '75%',
        height: '75%',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
    };
});

export const InnerSectionPaper = styled(Paper)<PaperPropsWithComponent<'section'>>(() => {
    return {
        margin: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        boxShadow: 'none'
    };
});

export const FooterPaper = styled(Paper)<PaperPropsWithComponent<'form'>>(() => {
    return {
        marginTop: 'auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        boxShadow: 'none',
    };
});
