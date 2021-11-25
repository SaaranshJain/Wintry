export enum HomeActionWithoutPayload {
    OPEN_DRAWER = 'HOME_OPEN_DRAWER',
    CLOSE_DRAWER = 'CLOSE_DRAWER',
}

export enum HomeActionWithPayload {
    SET_EMAIL = 'HOME_SET_EMAIL',
    SET_USERNAME = 'HOME_SET_USERNAME',
    SET_ID = 'HOME_SET_ID',
}

interface ActionWithoutPayload {
    type: HomeActionWithoutPayload;
}

interface ActionWithPayload<T> {
    type: HomeActionWithPayload;
    payload: T;
}

export type Action<T = string> = ActionWithoutPayload | ActionWithPayload<T>;

export const openDrawer = (): Action => {
    return {
        type: HomeActionWithoutPayload.OPEN_DRAWER,
    };
};

export const closeDrawer = (): Action => {
    return {
        type: HomeActionWithoutPayload.CLOSE_DRAWER,
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
