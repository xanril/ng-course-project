import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';
@Injectable()
export class RecipesEffects {

    constructor(private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>) {}

    fetchRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>("https://ng-udemy-c75e1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json")
                    .pipe(
                        map((recipes: Recipe[]) => {
                            const mappedRecipes = recipes?.map(recipe => {
                                return {
                                    ...recipe,
                                    ingredients: recipe.ingredients ? recipe.ingredients : []
                                };
                            });
            
                            return mappedRecipes;
                        }),
                        map((recipes: Recipe[]) => {
                            return new RecipesActions.SetRecipes(recipes);
                        })
                    );
            })
        );
    });

    storeRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipesState]) => {
                return this.http.put(
                        "https://ng-udemy-c75e1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json", 
                        [...recipesState.recipes]
                    );
            })
        )
    },
    {
        dispatch: false
    })
}