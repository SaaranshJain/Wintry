import { RegisterPageState } from '@/redux/registerPage/reducer';
import { State } from '@/redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import PageOne from './PageOne';
import PageTwo from './PageTwo';

const FormContent: React.FC = () => {
    const { activeStep } = useSelector<State, RegisterPageState>(state => state.registerPage);

    switch (activeStep) {
        case 0: {
            return <PageOne />;
        }
        case 1: {
            return <PageTwo />;
        }
        default: {
            return <div></div>;
        }
    }
};

export default FormContent;
