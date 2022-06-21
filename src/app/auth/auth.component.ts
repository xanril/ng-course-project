import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs/internal/types';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { AuthResponse, AuthService } from './auth.service';

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
  @ViewChild(PlaceholderDirective, {static: false}) alertHost!: PlaceholderDirective;

  constructor(
    private auth:AuthService,
    private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
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

    let authObservable: Observable<AuthResponse>;

    if(this.isLoginMode) {
      authObservable = this.auth.login(email, password);
    }
    else {
      authObservable = this.auth.signup(email, password);
    }

    authObservable.subscribe(this.handleSubscription());

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
