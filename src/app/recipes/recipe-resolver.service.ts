import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, take } from "rxjs";
import { Recipe } from "./recipe.model";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from './store/recipes.actions';
import { Actions, ofType } from "@ngrx/effects";

@Injectable({ providedIn: "root" })
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        this.store.dispatch(new RecipesActions.FetchRecipes());
        
        return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1),
            map((setRecipeData: RecipesActions.SetRecipes) => {
                return setRecipeData.payload ?? [];
            })
        );   
    }
}