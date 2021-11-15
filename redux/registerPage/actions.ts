export enum RegisterActionWithoutPayload {
    NEXT_STEP,
    PREV_STEP,
    SHOW_DIALOG,
    HIDE_DIALOG,
    CLEAR_PFP,
}

export enum RegisterActionWithPayload {
    SET_EMAIL = 5,
    SET_PASSWORD,
    SET_CONFIRM_PASSWORD,
    SET_DIALOG_MSG,
    SET_USERNAME,
    SET_ABOUT,
    SET_PFP,
}

interface ActionWithoutPayload {
    type: RegisterActionWithoutPayload;
}

interface ActionWithPayload<T> {
    type: RegisterActionWithPayload;
    payload: T;
}

export type Action<T = string> = ActionWithoutPayload | ActionWithPayload<T>;

export const nextStep = (): Action => {
    return {
        type: RegisterActionWithoutPayload.NEXT_STEP,
    };
};

export const prevStep = (): Action => {
    return {
        type: RegisterActionWithoutPayload.PREV_STEP,
    };
};

export const showDialog = (): Action => {
    return {
        type: RegisterActionWithoutPayload.SHOW_DIALOG,
    };
};

export const hideDialog = (): Action => {
    return {
        type: RegisterActionWithoutPayload.HIDE_DIALOG,
    };
};

export const clearPfp = (): Action => {
    return {
        type: RegisterActionWithoutPayload.CLEAR_PFP,
    };
};

export const setEmail = (email: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_EMAIL,
        payload: email,
    };
};

export const setPassword = (password: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_PASSWORD,
        payload: password,
    };
};

export const setConfirmPassword = (confirmPassword: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_CONFIRM_PASSWORD,
        payload: confirmPassword,
    };
};

export const setDialogMsg = (dialogMsg: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_DIALOG_MSG,
        payload: dialogMsg,
    };
};

export const setUsername = (username: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_USERNAME,
        payload: username,
    };
};

export const setAbout = (about: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_ABOUT,
        payload: about,
    };
};

export const setPfp = (pfp: File): Action<File> => {
    return {
        type: RegisterActionWithPayload.SET_PFP,
        payload: pfp,
    };
};
