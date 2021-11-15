import { createTheme, darkScrollbar } from '@mui/material';
import { purple, teal } from '@mui/material/colors';

export default createTheme({
    palette: {
        mode: 'dark',
        primary: purple,
        secondary: teal,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: darkScrollbar(),
            },
        },
    },
});
