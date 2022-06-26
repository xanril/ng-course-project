import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface AuthResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {

    constructor(private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService) { }

    handleAuthentication = (email: string, userId: string, token: string, expiresIn: string) => {
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        
        localStorage.setItem('userData', JSON.stringify(user));

        return new AuthActions.AuthenticateSuccess({
            email: email,
            userId: userId,
            token: token,
            expirationDate: expirationDate
        });
    }

    handleError = (errorRes:any) => {
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

        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
   
    authLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http.post<AuthResponse>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDCdpVqlZMumdjHrPB6HSBWBBU5Fb8u4ao',
                    {
                        email: authData.payload?.email,
                        password: authData.payload?.password,
                        returnSecureToken: true
                    }).pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            return this.handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn);
                        }),
                        catchError(errorRes => {
                            return this.handleError(errorRes);
                        })
                    );
            })
        );
    });

    authSignup$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((authData: AuthActions.SignupStart) => {
                return this.http.post<AuthResponse>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCdpVqlZMumdjHrPB6HSBWBBU5Fb8u4ao',
                    {
                        email: authData.payload?.email,
                        password: authData.payload?.password,
                        returnSecureToken: true
                    }).pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                            return this.handleAuthentication(resData.email, resData.localId, resData.idToken, resData.expiresIn);
                        }),
                        catchError(errorRes => {
                            return this.handleError(errorRes);
                        })
                    );
            })
        );
    });

    authRedirect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS),
            tap(() => {
                this.router.navigate(['/']);
            })
        );
    }, 
    { 
        dispatch: false
    });

    autoLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
                } = JSON.parse(localStorage.getItem('userData') ?? '{}');
                
                if (!userData) {
                    return { type: 'DUMMY' };
                }

                const loadedUser = new User(
                    userData.email,
                    userData.id,
                    userData._token,
                    new Date(userData._tokenExpirationDate)
                );

                if (loadedUser.token) {

                    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);

                    return new AuthActions.AuthenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate)
                    });
                }

                return { type: 'DUMMY'};
            })
        )
    })

    authLogout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        );
    },
    {
        dispatch: false
    });
}