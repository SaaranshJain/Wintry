import { Button, Paper, Step, StepLabel, Stepper } from '@mui/material';
import type { NextPage } from 'next';
import styles from '@/styles/Register.module.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterPageState } from '@/redux/registerPage/reducer';
import RegisterPageDialog from '@/components/Register/Dialog';
import FormContent from '@/components/Register/FormContent';
import axios from 'axios';
import { OutgoingDataRegister } from './api/register';
import { useRouter } from 'next/router';
import { nextStep, prevStep, setDialogMsg, showDialog } from '@/redux/registerPage/actions';
import { State } from '@/redux/store';
import { OutgoingDataCheckEmail } from './api/check-email';
import { OutgoingDataVerifyOTP } from './api/verify-otp';

const steps = ['Enter login information', 'Verify your email', 'Create your profile'];

const Register: NextPage = () => {
    const { about, activeStep, confirmPassword, email, password, pfp, username, code } = useSelector<
        State,
        RegisterPageState
    >(state => state.registerPage);

    const dispatch = useDispatch();
    const router = useRouter();

    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            router.push('/');
        }
    }, [router]);

    const handleNextStep = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        if (activeStep === steps.length - 1) return;

        ev.preventDefault();

        if (activeStep === 0) {
            if (!email || !password || !confirmPassword) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('One or more required fields are missing'));
            }

            if (password !== confirmPassword) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('The passwords do not match'));
            }

            const res = await axios.post<OutgoingDataCheckEmail>(`/api/check-email`, { email });

            if (!res.data.allow) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('That email is taken'));
            }

            return dispatch(nextStep());
        }

        if (activeStep === 1) {
            if (!code) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('Please enter the code'));
            }

            const res = await axios.post<OutgoingDataVerifyOTP>('/api/verify-otp', { email, otp: code });

            if (!res.data.verified) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('Incorrect OTP'));
            }

            return dispatch(nextStep());
        }

        if (activeStep === 2) {
            if (!username) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('Please enter a username'));
            }

            dispatch(nextStep());
        }
    };

    const handlePreviousStep = (ev: React.MouseEvent<HTMLButtonElement>) => {
        if (activeStep !== 0) {
            dispatch(prevStep());
        }
    };

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const body = new FormData();
        body.append('email', email);
        body.append('password', password);
        body.append('username', username);
        pfp && body.append('pfp', pfp);
        body.append('about', about);

        const token = (await axios.post<OutgoingDataRegister>('/api/register', body)).data.token;

        if (!token) {
            dispatch(setDialogMsg('Something went wrong on our end, please try again later'));
            return dispatch(showDialog());
        }

        localStorage.setItem('token', token);
        router.push('/');
    };

    return (
        <section className={styles['container']}>
            <Paper component="form" elevation={1} onSubmit={handleSubmit}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <section>
                    <RegisterPageDialog />
                    <FormContent />
                </section>
                <footer>
                    <Button onClick={handlePreviousStep} disabled={activeStep === 0}>
                        Back
                    </Button>
                    <Button type="submit" onClick={handleNextStep}>
                        {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                    </Button>
                </footer>
            </Paper>
        </section>
    );
};

export default Register;
