import { Chat } from '@/pages/api/verify';

export enum HomeActionWithoutPayload {
    OPEN_LEFT_DRAWER = 'HOME_OPEN_LEFT_DRAWER',
    CLOSE_LEFT_DRAWER = 'HOME_CLOSE_LEFT_DRAWER',
    OPEN_RIGHT_DRAWER = 'HOME_OPEN_RIGHT_DRAWER',
    CLOSE_RIGHT_DRAWER = 'HOME_CLOSE_RIGHT_DRAWER',
}

export enum HomeActionWithPayload {
    SET_EMAIL = 'HOME_SET_EMAIL',
    SET_USERNAME = 'HOME_SET_USERNAME',
    SET_ID = 'HOME_SET_ID',
    SET_CHATS = 'HOME_SET_CHATS',
}

interface ActionWithoutPayload {
    type: HomeActionWithoutPayload;
}

interface ActionWithPayload<T> {
    type: HomeActionWithPayload;
    payload: T;
}

export type Action<T = string> = ActionWithoutPayload | ActionWithPayload<T>;

export const openLeftDrawer = (): Action => {
    return {
        type: HomeActionWithoutPayload.OPEN_LEFT_DRAWER,
    };
};

export const closeLeftDrawer = (): Action => {
    return {
        type: HomeActionWithoutPayload.CLOSE_LEFT_DRAWER,
    };
};

export const openRightDrawer = (): Action => {
    return {
        type: HomeActionWithoutPayload.OPEN_RIGHT_DRAWER,
    };
};

export const closeRightDrawer = (): Action => {
    return {
        type: HomeActionWithoutPayload.CLOSE_RIGHT_DRAWER,
    };
};

export const setEmail = (email: string): Action => {
    return {
        type: HomeActionWithPayload.SET_EMAIL,
        payload: email,
    };
};

export const setUsername = (username: string): Action => {
    return {
        type: HomeActionWithPayload.SET_USERNAME,
        payload: username,
    };
};

export const setID = (id: string): Action => {
    return {
        type: HomeActionWithPayload.SET_ID,
        payload: id,
    };
};

export const setChats = (chats: [Chat[], Chat[]]): Action<[Chat[], Chat[]]> => {
    return {
        type: HomeActionWithPayload.SET_CHATS,
        payload: chats,
    };
};
