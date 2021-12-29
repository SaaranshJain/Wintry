import type { NextPage } from 'next';
import type { OutgoingDataLogin } from './api/login';

import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { Close } from '@mui/icons-material';
import { DialogIconButton } from '@/components/Auth/Register/Dialog/helpers';
import { ContainerSection, FooterPaper, FormPaper, InnerSectionPaper } from '@/components/Auth/helpers';

import React from 'react';
import axios from 'axios';
import Head from 'next/head';

const Login: NextPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogMsg, setDialogMsg] = React.useState('');
    const router = useRouter();

    const handleSubmit = async (ev: React.FormEvent<HTMLDivElement> | React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const {
            data: { token, message },
        } = await axios.post<OutgoingDataLogin>('/api/login', { email, password });

        if (!token) {
            setDialogOpen(true);
            setDialogMsg(message);
            return;
        }

        localStorage.setItem('token', token);
        router.push('/');
    };

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            router.push('/');
        }
    }, [router]);

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <ContainerSection component="section" elevation={0}>
                <FormPaper component="form" elevation={1} onSubmit={handleSubmit}>
                    <InnerSectionPaper component="section">
                        <Dialog open={dialogOpen}>
                            <DialogTitle>
                                Error
                                <DialogIconButton onClick={() => setDialogOpen(false)}>
                                    <Close />
                                </DialogIconButton>
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>{dialogMsg}</DialogContentText>
                            </DialogContent>
                        </Dialog>
                        <TextField
                            required
                            value={email}
                            onChange={ev => setEmail(ev.target.value)}
                            type="text"
                            fullWidth
                            color="primary"
                            label="Email Address"
                        />
                        <TextField
                            required
                            value={password}
                            onChange={ev => setPassword(ev.target.value)}
                            type="password"
                            fullWidth
                            color="primary"
                            label="Password"
                        />
                    </InnerSectionPaper>
                    <FooterPaper component="footer">
                        <Button
                            variant="outlined"
                            sx={{ marginRight: 'auto' }}
                            onClick={() => router.push('/register')}
                        >
                            Register Instead
                        </Button>
                        <Button variant="outlined" sx={{ marginLeft: 'auto' }} type="submit">
                            Submit
                        </Button>
                    </FooterPaper>
                </FormPaper>
            </ContainerSection>
        </>
    );
};

export default Login;
