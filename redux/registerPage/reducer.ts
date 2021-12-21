import { Action, RegisterActionWithPayload, RegisterActionWithoutPayload } from './actions';

export interface RegisterPageState {
    about: string;
    activeStep: number;
    confirmPassword: string;
    dialogMsg: string;
    dialogOpen: boolean;
    displayName: string;
    email: string;
    password: string;
    pfp?: File;
    username: string;
    code: string;
}

const initialState: RegisterPageState = {
    about: '',
    activeStep: 0,
    code: '',
    confirmPassword: '',
    dialogMsg: '',
    dialogOpen: false,
    displayName: '',
    email: '',
    password: '',
    username: '',
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

        case RegisterActionWithPayload.SET_DISPLAY_NAME: {
            return {
                ...state,
                displayName: action.payload
            }
        }

        default: {
            return state;
        }
    }
};

export default reducer;
