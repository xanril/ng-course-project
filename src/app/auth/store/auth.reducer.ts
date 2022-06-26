import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user?: User;
    authError?: string;
    loading: boolean;
}

const initialState: State = {
    user: undefined,
    authError: undefined,
    loading: false
}

export function authReducer(state: State = initialState, action:AuthActions.AuthActions) {
    switch(action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS:
            const loginAction = action as AuthActions.AuthenticateSuccess;
            const newUser: User = new User(
                loginAction.payload!.email,
                loginAction.payload!.userId,
                loginAction.payload!.token,
                loginAction.payload!.expirationDate
            );
            
            return {
                ...state,
                user: newUser,
                loading: false
            }

        case AuthActions.LOGOUT:
            return {
                ...state,
                user: undefined
            }

        case AuthActions.LOGIN_START:
        case AuthActions.SIGNUP_START:
            return {
                ...state,
                authError: undefined,
                loading: true
            }

        case AuthActions.AUTHENTICATE_FAIL:
            const loginFailAction = action as AuthActions.AuthenticateFail;
            return {
                ...state,
                user: undefined,
                authError: loginFailAction.payload,
                loading: false
            }

        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: undefined
            }

        default:
            return state;
    }
}