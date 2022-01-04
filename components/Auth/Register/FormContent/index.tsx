import type { RegisterPageState } from '@/redux/registerPage/reducer';
import type { State } from '@/redux/store';

import { useSelector } from 'react-redux';

import PageOne from './PageOne';
import PageThree from './PageThree';
import PageTwo from './PageTwo';
import React from 'react';

const FormContent: React.FC = () => {
    const { activeStep } = useSelector<State, RegisterPageState>(state => state.registerPage);

    switch (activeStep) {
        case 0: {
            return <PageOne />;
        }
        case 1: {
            return <PageTwo />;
        }
        case 2: {
            return <PageThree />;
        }
        default: {
            return <div></div>;
        }
    }
};

export default FormContent;
