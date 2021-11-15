export enum HomeActionWithoutPayload {}

export enum HomeActionWithPayload {
    SET_EMAIL,
    SET_USERNAME,
    SET_ID,
}

interface ActionWithoutPayload {
    type: HomeActionWithoutPayload;
}

interface ActionWithPayload<T> {
    type: HomeActionWithPayload;
    payload: T;
}

export type Action<T = string> = ActionWithoutPayload | ActionWithPayload<T>;

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
