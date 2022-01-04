export enum RegisterActionWithoutPayload {
    NEXT_STEP = 'REGISTER_NEXT_STEP',
    PREV_STEP = 'REGISTER_PREV_STEP',
    SHOW_DIALOG = 'REGISTER_SHOW_DIALOG',
    HIDE_DIALOG = 'REGISTER_HIDE_DIALOG',
    CLEAR_PFP = 'REGISTER_CLEAR_PFP',
}

export enum RegisterActionWithPayload {
    SET_EMAIL = 'REGISTER_SET_EMAIL',
    SET_PASSWORD = 'REGISTER_SET_PASSWORD',
    SET_CONFIRM_PASSWORD = 'REGISTER_SET_CONFIRM_PASSWORD',
    SET_DIALOG_MSG = 'REGISTER_SET_DIALOG_MSG',
    SET_USERNAME = 'REGISTER_SET_USERNAME',
    SET_ABOUT = 'REGISTER_SET_ABOUT',
    SET_PFP = 'REGISTER_SET_PFP',
    SET_CODE = 'REGISTER_SET_CODE',
    SET_DISPLAY_NAME = 'REGISTER_SET_DISPLAY_NAME',
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

export const setPfp = (pfp: File | null): Action<File | null> => {
    return {
        type: RegisterActionWithPayload.SET_PFP,
        payload: pfp,
    };
};

export const setCode = (code: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_CODE,
        payload: code,
    };
};

export const setDisplayName = (displayName: string): Action => {
    return {
        type: RegisterActionWithPayload.SET_DISPLAY_NAME,
        payload: displayName
    }
}
