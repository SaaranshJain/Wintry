import { Action, HomeActionWithoutPayload, HomeActionWithPayload } from './actions';

export interface HomePageState {
    id: string;
    email: string;
    username: string;
    widthMatch: boolean;
    drawerOpen: boolean;
}

const initialState: HomePageState = {
    id: '',
    email: '',
    username: '',
    widthMatch: true,
    drawerOpen: false,
};

const reducer = (state = initialState, action: Action<any>): HomePageState => {
    switch (action.type) {
        case HomeActionWithPayload.SET_EMAIL: {
            return {
                ...state,
                email: action.payload as string,
            };
        }

        case HomeActionWithPayload.SET_ID: {
            return {
                ...state,
                id: action.payload as string,
            };
        }

        case HomeActionWithPayload.SET_USERNAME: {
            return {
                ...state,
                username: action.payload as string,
            };
        }

        case HomeActionWithoutPayload.OPEN_DRAWER: {
            return {
                ...state,
                drawerOpen: true,
            }
        }

        case HomeActionWithoutPayload.CLOSE_DRAWER: {
            return {
                ...state,
                drawerOpen: false,
            }
        }

        default: {
            return state;
        }
    }
};

export default reducer;
