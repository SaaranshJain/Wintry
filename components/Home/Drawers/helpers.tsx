import {
    Accordion,
    AccordionDetails,
    AccordionDetailsProps,
    AccordionProps,
    Avatar,
    AvatarProps,
    Drawer,
    DrawerProps,
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
    ListItemIconProps,
    styled,
} from '@mui/material';

export const ListIconWithMinWidth = styled(ListItemIcon)<ListItemIconProps>(() => {
    return { minWidth: 0 };
});

type ConditionalAvatarProps = AvatarProps & {
    pfp: boolean;
};

export const StyledAvatarLeftDrawer = styled(Avatar, {
    shouldForwardProp: prop => prop !== 'pfp',
})<ConditionalAvatarProps>(({ theme, pfp }) => {
    if (pfp) {
        return { outline: `2px solid ${theme.palette.primary.main}` };
    }

    return { backgroundColor: theme.palette.primary.main };
});

export const LeftDrawerOutline = styled(Drawer)<DrawerProps>(() => {
    return { width: 72, [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' } };
});

export const FullWidthAccordion = styled(Accordion)<AccordionProps>(() => {
    return { width: 240 };
});

export const PaddedAccordionDetails = styled(AccordionDetails)<AccordionDetailsProps>(() => {
    return { padding: '0.5rem' };
});

export const AccordionListItem = styled(ListItemButton)<ListItemButtonProps>(({ theme }) => {
    return {
        borderRadius: '15px',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '0.5rem',
        [':hover']: { backgroundColor: theme.palette.primary.dark },
    };
});

export const StyledAvatarRightDrawer = styled(Avatar, {
    shouldForwardProp: prop => prop !== 'pfp',
})<ConditionalAvatarProps>(({ theme, pfp }) => {
    if (!pfp) {
        return { backgroundColor: theme.palette.primary.light };
    }
});

export const RightDrawerOutline = styled(Drawer)<DrawerProps>(() => {
    return { width: '72', [`& .MuiDrawer-paper`]: { boxSizing: 'border-box' } };
});

type StyledLeftDrawerListItemProps = ListItemButtonProps & { selected: boolean };

export const StyledLeftDrawerListItem = styled(ListItemButton, {
    shouldForwardProp: prop => prop !== 'selected',
})<StyledLeftDrawerListItemProps>(({ theme, selected }) => {
    if (selected) {
        return { backgroundColor: theme.palette.action.selected };
    }
});
