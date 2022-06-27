import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, of, take, switchMap } from "rxjs";
import { Recipe } from "./recipe.model";
import * as fromApp from '../store/app.reducer';
import * as fromRecipes from './store/recipes.reducer';
import * as RecipesActions from './store/recipes.actions';
import { Actions, ofType } from "@ngrx/effects";

@Injectable({ providedIn: "root" })
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(private store: Store<fromApp.AppState>,
        private actions$: Actions) { }
    
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {    
        return this.store.select('recipes').pipe(
            take(1),
            map((recipesState: fromRecipes.State) => {
                return recipesState.recipes;
            }),
            switchMap((recipes: Recipe[]) => {
                if (recipes.length === 0) {
                    this.store.dispatch(new RecipesActions.FetchRecipes());

                    return this.actions$.pipe(
                        ofType(RecipesActions.SET_RECIPES),
                        take(1),
                        map((setRecipeData: RecipesActions.SetRecipes) => {
                            return setRecipeData.payload ?? [];
                        })
                    ); 
                }
                else {
                    return of(recipes);
                }
            })
        ) 
    }
}