import type { NextPage } from 'next';

import { Box, CssBaseline, Toolbar } from '@mui/material';

import AddFriendModal from '@/components/Home/Modals/AddFriendModal';
import CreateRoomModal from '@/components/Home/Modals/CreateRoomModal';
import Navbar from '@/components/Home/Navbar';
import Head from 'next/head';

const SettingsPage: NextPage = () => {
    return (
        <>
            <Head>
                <title>Omnipresent</title>
            </Head>
            <AddFriendModal />
            <CreateRoomModal />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Navbar />
                
                <Box component="main" sx={{ width: '100%' }}>
                    <Toolbar />
                </Box>
            </Box>
        </>
    );
};

export default SettingsPage;
