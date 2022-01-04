import type { NextPage } from 'next';
import type { OutgoingDataLogin } from './api/login';

import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { ContainerSection, FooterPaper, FormPaper, InnerSectionPaper } from '@/components/Auth/helpers';

import React from 'react';
import axios from 'axios';
import Head from 'next/head';
import PageDialog from '@/components/Auth/Register/Dialog';

const Login: NextPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogMsg, setDialogMsg] = React.useState('');
    const router = useRouter();

    const handleSubmit = async (ev: React.FormEvent<HTMLDivElement> | React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        axios
            .post<OutgoingDataLogin>('/api/login', { email, password })
            .then(res => {
                const { token } = res.data;
                token && localStorage.setItem('token', token);
                router.push('/');
            })
            .catch(err => {
                setDialogOpen(true);
                setDialogMsg(err.response.data.message);
            });
    };

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <ContainerSection component="section" elevation={0}>
                <FormPaper component="form" elevation={1} onSubmit={handleSubmit}>
                    <InnerSectionPaper component="section">
                        <PageDialog
                            dialogMsg={dialogMsg}
                            dialogOpen={dialogOpen}
                            handleClose={() => setDialogOpen(false)}
                        />
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
