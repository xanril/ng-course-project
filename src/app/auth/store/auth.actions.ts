import { Action } from "@ngrx/store";

export const AUTHENTICATE_SUCCESS: string = 'AUTHENTICATE';
export const LOGOUT: string = 'LOGOUT';
export const LOGIN_START: string = 'LOGIN_START';
export const SIGNUP_START: string = 'SIGNUP_START';
export const AUTHENTICATE_FAIL: string = 'AUTHENTICATE_FAIL';
export const CLEAR_ERROR: string = 'CLEAR_ERROR';
export const AUTO_LOGIN: string = 'AUTO_LOGIN';

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {
        email: string,
        userId: string,
        token: string,
        expirationDate: Date
    }) { }
} 

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    payload?: { email: string, password: string };

    constructor(payload: { email: string, password: string }) {
        this.payload = payload;
    }
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
    payload?: string;

    constructor(payload: string) {
        this.payload = payload;
    }
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    payload?: { email: string, password: string };

    constructor(payload: { email: string, password: string }) {
        this.payload = payload;
    }
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions = 
    AuthenticateSuccess 
    | Logout 
    | LoginStart 
    | AuthenticateFail 
    | SignupStart 
    | ClearError
    | AutoLogin;