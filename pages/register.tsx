import type { NextPage } from 'next';
import type { RegisterPageState } from '@/redux/registerPage/reducer';
import type { OutgoingDataRegister } from './api/register';
import type { OutgoingDataCheckEmail } from './api/check-email';
import type { OutgoingDataVerifyOTP } from './api/verify-otp';

import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { hideDialog, nextStep, prevStep, setDialogMsg, showDialog } from '@/redux/registerPage/actions';
import { State } from '@/redux/store';
import { ContainerSection, FooterPaper, FormPaper, InnerSectionPaper } from '@/components/Auth/helpers';

import React from 'react';
import RegisterPageDialog from '@/components/Auth/Register/Dialog';
import FormContent from '@/components/Auth/Register/FormContent';
import axios from 'axios';
import Head from 'next/head';

const steps = ['Enter login information', 'Verify your email', 'Create your profile'];

const Register: NextPage = () => {
    const {
        about,
        activeStep,
        confirmPassword,
        dialogMsg,
        dialogOpen,
        displayName,
        email,
        password,
        pfp,
        username,
        code,
    } = useSelector<State, RegisterPageState>(state => state.registerPage);

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

            if (!username.match(/^[a-z]{1,32}$/g)) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('Username does not match criteria'));
            }

            if (password !== confirmPassword) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('The passwords do not match'));
            }

            axios
                .post<OutgoingDataCheckEmail>(`/api/check-email`, { email, username })
                .then(() => {
                    dispatch(nextStep());
                })
                .catch(() => {
                    dispatch(showDialog());
                    dispatch(setDialogMsg('That email or username is taken'));
                });
        }

        if (activeStep === 1) {
            if (!code) {
                dispatch(showDialog());
                return dispatch(setDialogMsg('Please enter the code'));
            }

            axios
                .post<OutgoingDataVerifyOTP>('/api/verify-otp', { email, otp: code })
                .then(() => {
                    dispatch(nextStep());
                })
                .catch(() => {
                    dispatch(showDialog());
                    dispatch(setDialogMsg('Incorrect OTP'));
                });
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

    const handleSubmit = async (ev: React.FormEvent<HTMLDivElement> & React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        const body = new FormData();
        body.append('email', email);
        body.append('password', password);
        body.append('username', username);
        body.append('displayName', displayName);
        pfp && body.append('pfp', pfp);
        body.append('about', about);

        axios
            .post<OutgoingDataRegister>('/api/register', body)
            .then(res => {
                const { token } = res.data;

                token && localStorage.setItem('token', token);
                router.push('/');
            })
            .catch(() => {
                dispatch(setDialogMsg('Something went wrong on our end, please try again later'));
                dispatch(showDialog());
            });
    };

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <ContainerSection component="section" elevation={0}>
                <FormPaper component="form" elevation={1} onSubmit={handleSubmit}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            return (
                                <Step key={index}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <InnerSectionPaper component="section">
                        <RegisterPageDialog
                            dialogMsg={dialogMsg}
                            dialogOpen={dialogOpen}
                            handleClose={() => dispatch(hideDialog())}
                        />
                        <FormContent />
                    </InnerSectionPaper>
                    <FooterPaper component="footer">
                        <Button
                            variant="outlined"
                            sx={{ marginRight: 'auto' }}
                            onClick={handlePreviousStep}
                            disabled={activeStep === 0}
                        >
                            Back
                        </Button>
                        <Button variant="outlined" sx={{ marginLeft: 'auto' }} type="submit" onClick={handleNextStep}>
                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                        </Button>
                    </FooterPaper>
                </FormPaper>
            </ContainerSection>
        </>
    );
};

export default Register;
