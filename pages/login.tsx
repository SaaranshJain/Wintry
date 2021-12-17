import type { NextPage } from 'next';
import type { OutgoingDataLogin } from './api/login';

import {
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { Close } from '@mui/icons-material';
import { DialogIconButton } from '@/components/Register/Dialog/helpers';

import styles from '@/styles/Login.module.scss';
import React from 'react';
import axios from 'axios';

const Login: NextPage = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogMsg, setDialogMsg] = React.useState('');
    const router = useRouter();

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
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
        <section className={styles['container']}>
            <Paper component="form" elevation={1} onSubmit={handleSubmit}>
                <section>
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
                </section>
                <footer>
                    <Button type="submit">Submit</Button>
                </footer>
            </Paper>
        </section>
    );
};

export default Login;
