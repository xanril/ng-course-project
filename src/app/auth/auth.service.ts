import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

export interface AuthResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    autoLogoutExpirationTimer: any;

    constructor(
        private store: Store<AppState>) {}

    setLogoutTimer(expirationDuration: number) {
        this.autoLogoutExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }

    clearLogoutTimer() {
        if(this.autoLogoutExpirationTimer) {
            clearTimeout(this.autoLogoutExpirationTimer);
        }
        this.autoLogoutExpirationTimer = null;
    }
}