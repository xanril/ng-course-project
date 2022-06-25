import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, Observable, take } from "rxjs";
import { AppState } from "../store/app.reducer";
import { AuthService } from "./auth.service";

@Injectable( { providedIn: "root" } )
export class AuthInterceptorService implements HttpInterceptor {
    
    constructor(
        private authService: AuthService,
        private store: Store<AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            exhaustMap(user => {
                if ( !user ) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: req.params.set("auth", user?.token ? user.token : "")
                });
                return next.handle(modifiedReq);
            })
        );
    }
}