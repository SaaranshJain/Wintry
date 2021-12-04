import { Action, RegisterActionWithPayload, RegisterActionWithoutPayload } from './actions';

export interface RegisterPageState {
    email: string;
    password: string;
    confirmPassword: string;
    activeStep: number;
    dialogOpen: boolean;
    dialogMsg: string;
    username: string;
    about: string;
    pfp?: File;
    code: string;
}

const initialState: RegisterPageState = {
    email: '',
    password: '',
    confirmPassword: '',
    activeStep: 0,
    dialogOpen: false,
    dialogMsg: '',
    username: '',
    about: '',
    code: '',
};

const reducer = (state = initialState, action: Action): RegisterPageState => {
    switch (action.type) {
        case RegisterActionWithoutPayload.NEXT_STEP: {
            return {
                ...state,
                activeStep: state.activeStep + 1,
            };
        }

        case RegisterActionWithoutPayload.PREV_STEP: {
            return {
                ...state,
                activeStep: state.activeStep - 1,
            };
        }

        case RegisterActionWithPayload.SET_EMAIL: {
            return {
                ...state,
                email: action.payload,
            };
        }

        case RegisterActionWithPayload.SET_PASSWORD: {
            return {
                ...state,
                password: action.payload,
            };
        }

        case RegisterActionWithPayload.SET_CONFIRM_PASSWORD: {
            return {
                ...state,
                confirmPassword: action.payload,
            };
        }

        case RegisterActionWithoutPayload.SHOW_DIALOG: {
            return {
                ...state,
                dialogOpen: true,
            };
        }

        case RegisterActionWithoutPayload.HIDE_DIALOG: {
            return {
                ...state,
                dialogOpen: false,
            };
        }

        case RegisterActionWithPayload.SET_DIALOG_MSG: {
            return {
                ...state,
                dialogMsg: action.payload,
            };
        }

        case RegisterActionWithPayload.SET_USERNAME: {
            return {
                ...state,
                username: action.payload,
            };
        }

        case RegisterActionWithPayload.SET_ABOUT: {
            return {
                ...state,
                about: action.payload,
            };
        }

        case RegisterActionWithPayload.SET_PFP: {
            return {
                ...state,
                // @ts-ignore
                pfp: action.payload,
            };
        }

        case RegisterActionWithoutPayload.CLEAR_PFP: {
            return {
                ...state,
                pfp: undefined,
            };
        }

        case RegisterActionWithPayload.SET_CODE: {
            return {
                ...state,
                code: action.payload,
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer;
