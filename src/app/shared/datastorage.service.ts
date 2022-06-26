import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";
import * as fromApp from '../store/app.reducer'
import * as RecipesActions from '../recipes/store/recipes.actions';
import { Store } from "@ngrx/store";

@Injectable({ providedIn: "root" })
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.http
            .put("https://ng-udemy-c75e1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json", recipes)
            .subscribe(response => {
                console.log(response);
            });
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>("https://ng-udemy-c75e1-default-rtdb.asia-southeast1.firebasedatabase.app/recipes.json",)
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
                tap(recipes => {
                    // console.log(recipes);
                    this.store.dispatch(new RecipesActions.SetRecipes(recipes));
                })
            );
    }
}