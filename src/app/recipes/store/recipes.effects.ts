import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';

@Injectable()
export class RecipesEffects {

    constructor(private actions$: Actions,
        private http: HttpClient) {}

    fetchRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>("https://ng-udemy-c75e1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json")
                    .pipe(
                        map((recipes: Recipe[]) => {
                            const mappedRecipes = recipes.map(recipe => {
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
}