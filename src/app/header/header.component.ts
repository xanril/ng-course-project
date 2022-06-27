import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authSubscription!: Subscription;
  isAuthenticated: boolean = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authSubscription = this.store.select('auth')
      .pipe(
        map(authState => {
          return authState.user;
        })
      )
      .subscribe(
        user => {
          this.isAuthenticated = !!user;
        }
      );
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
