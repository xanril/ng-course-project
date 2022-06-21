import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeService: RecipeService) {}

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
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap(recipes => {
                    // console.log(recipes);
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}