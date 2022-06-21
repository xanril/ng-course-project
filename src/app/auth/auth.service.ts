import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

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

    userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
    autoLogoutExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCdpVqlZMumdjHrPB6HSBWBBU5Fb8u4ao',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap(response => {
                    this.handleAuthentication(
                        response.email,
                        response.localId,
                        response.idToken,
                        +response.expiresIn
                    )
                }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDCdpVqlZMumdjHrPB6HSBWBBU5Fb8u4ao',
            {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError),
            tap(response => {
                this.handleAuthentication(
                    response.email,
                    response.localId,
                    response.idToken,
                    +response.expiresIn
                )
            }));
    }

    handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.userSubject.next(user);

        this.autoLogout(expiresIn * 1000);

        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: any) {
        let errorMessage = 'An unknown error occurred!';
        const errorType = errorRes.error.error.message;

        switch(errorType) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already.';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Operation not allowed.';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'Too many attempts. Try again later.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
        }

        return throwError(() => { new Error(errorMessage) });
    }

    logout() {
        this.userSubject.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');

        if(this.autoLogoutExpirationTimer) {
            clearTimeout(this.autoLogoutExpirationTimer);
        }
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData') ?? '{}');
    
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.userSubject.next(loadedUser);

            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }   
    }

    autoLogout(expirationDuration: number) {
        this.autoLogoutExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }
}