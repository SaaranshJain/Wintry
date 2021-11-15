import { Action, HomeActionWithPayload } from './actions';

export interface HomePageState {
    id: string;
    email: string;
    username: string;
}

const initialState: HomePageState = {
    id: '',
    email: '',
    username: '',
};

const reducer = (state = initialState, action: Action): HomePageState => {
    switch (action.type) {
        case HomeActionWithPayload.SET_EMAIL: {
            return {
                ...state,
                email: action.payload,
            };
        }

        case HomeActionWithPayload.SET_ID: {
            return {
                ...state,
                id: action.payload,
            };
        }

        case HomeActionWithPayload.SET_USERNAME: {
            return {
                ...state,
                username: action.payload,
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer
