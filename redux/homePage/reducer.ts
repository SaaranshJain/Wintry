import { Chat } from '@/pages/api/verify';
import { Action, HomeActionWithoutPayload, HomeActionWithPayload } from './actions';

export interface HomePageState {
    id: string;
    email: string;
    username: string;
    widthMatch: boolean;
    leftDrawerOpen: boolean;
    rightDrawerOpen: boolean;
    chats: [Chat[], Chat[]] | [];
    currentChat: string;
    loading: boolean;
    modalState: 'closed' | 'add-friend' | 'create-room';
}

const initialState: HomePageState = {
    id: '',
    email: '',
    username: '',
    widthMatch: true,
    leftDrawerOpen: false,
    rightDrawerOpen: false,
    chats: [],
    currentChat: 'omnipresent',
    loading: true,
    modalState: 'closed',
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

        case HomeActionWithoutPayload.OPEN_LEFT_DRAWER: {
            return {
                ...state,
                leftDrawerOpen: true,
            };
        }

        case HomeActionWithoutPayload.CLOSE_LEFT_DRAWER: {
            return {
                ...state,
                leftDrawerOpen: false,
            };
        }

        case HomeActionWithoutPayload.OPEN_RIGHT_DRAWER: {
            return {
                ...state,
                rightDrawerOpen: true,
            };
        }

        case HomeActionWithoutPayload.CLOSE_RIGHT_DRAWER: {
            return {
                ...state,
                rightDrawerOpen: false,
            };
        }

        case HomeActionWithPayload.SET_CHATS: {
            return {
                ...state,
                chats: action.payload as [Chat[], Chat[]],
            };
        }

        case HomeActionWithPayload.SET_CURRENT_CHAT: {
            return {
                ...state,
                currentChat: action.payload as string,
            };
        }

        case HomeActionWithoutPayload.SET_LOADING_TRUE: {
            return {
                ...state,
                loading: true,
            };
        }

        case HomeActionWithoutPayload.SET_LOADING_FALSE: {
            return {
                ...state,
                loading: false,
            };
        }

        case HomeActionWithPayload.SET_MODAL_STATE: {
            return {
                ...state,
                modalState: action.payload as 'closed' | 'add-friend' | 'create-room',
            };
        }

        default: {
            return state;
        }
    }
};

export default reducer;
