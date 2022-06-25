import { Action } from "@ngrx/store";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
    user?: User;
}

const initialState: State = {
    user: undefined
}

export function authReducer(state: State = initialState, action:AuthActions.AuthActions) {
    switch(action.type) {
        case AuthActions.LOGIN:
            const loginAction = action as AuthActions.Login;
            const newUser: User = new User(
                loginAction.payload.email,
                loginAction.payload.userId,
                loginAction.payload.token,
                loginAction.payload.expirationDate
            );
            
            return {
                ...state,
                user: newUser
            }

        case AuthActions.LOGOUT:
            return {
                ...state,
                user: undefined
            }

        default:
            return state;
    }
}