import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Observer } from 'rxjs/internal/types';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponse, AuthService } from './auth.service';
import * as fromApp from './../store/app.reducer'
import * as AuthActions from './store/auth.actions'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  closeSubscription!: Subscription;
  storeSubscription!: Subscription;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost!: PlaceholderDirective;

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSubscription = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.errorMessage = authState.authError ?? '';

      if(this.errorMessage !== '') {
        this.showErrorAlert(this.errorMessage);
      }
    })
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();

    if(this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
  
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {

    if (!authForm.valid) {
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;

    this.isLoading = true;
    this.errorMessage = '';

    if(this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({
        email: email,
        password: password
      }));
    }
    else {
      this.store.dispatch(new AuthActions.SignupStart({
        email: email,
        password: password
      }));
    }

    authForm.reset();
  }

  handleSubscription() : Partial<Observer<AuthResponse>> {
    return {
      next: (response: AuthResponse) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: error => {
        this.errorMessage = error;
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    };
  }

  showErrorAlert(message: string) {
    const hostContainer = this.alertHost.viewContainerRef;
    hostContainer.clear();

    let componentRef = hostContainer.createComponent(AlertComponent);
    componentRef.instance.message = message;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      hostContainer.clear();
      this.closeSubscription.unsubscribe();
    });
  }
}
