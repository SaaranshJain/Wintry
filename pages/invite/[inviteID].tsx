import { HomePageState } from '@/redux/homePage/reducer';
import { State } from '@/redux/store';
import axios from 'axios';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { OutgoingDataVerifyInvite } from '../api/verify-invite';

const Invite: NextPage<{ inviteID: string }> = ({ inviteID }) => {
    const { username } = useSelector<State, HomePageState>(state => state.homePage);
    const router = useRouter();

    React.useEffect(() => {
        axios.post<OutgoingDataVerifyInvite>('/api/verify-invite', { inviteID, username }).finally(() => {
            router.push('/');
        });
    }, [inviteID, router]);

    return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async ({ query: { inviteID } }) => {
    if (!inviteID) {
        return { props: {}, redirect: { destination: '/', statusCode: 400 } };
    }

    return { props: { inviteID } };
};

export default Invite;
