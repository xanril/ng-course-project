import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES: string = '[Recipes] Set Recipes';
export const FETCH_RECIPES: string = '[Recipes] Fetch Recipes';
export const ADD_RECIPE: string = '[Recipes] Add Recipe';
export const UPDATE_RECIPE: string = '[Recipes] Update Recipe';
export const DELETE_RECIPE: string = '[Recipes] Delete Recipe';
export const STORE_RECIPES: string = '[Recipes] Store Recipes';
export const DELETE_INGREDIENT: string = '[Recipes] Delete Ingredient';

export class SetRecipes implements Action {
    readonly type = SET_RECIPES;
    payload?:Recipe[];

    constructor(payload: Recipe[]) {
        this.payload = payload;
    }
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
    readonly type: string = ADD_RECIPE;

    constructor(public payload?: Recipe) {}
}

export class UpdateRecipe implements Action {
    readonly type: string = UPDATE_RECIPE;

    constructor(public payload?:{
        index: number,
        recipe: Recipe
    }) {}
}

export class DeleteRecipe implements Action {
    readonly type: string = DELETE_RECIPE;

    constructor(public payload?:number) {}
}

export class StoreRecipes implements Action {
    readonly type: string = STORE_RECIPES;
}

export class DeleteIngredient implements Action {
    readonly type: string = DELETE_INGREDIENT;

    constructor(public payload?: {
        recipeIndex: number,
        ingredientIndex: number
    }) {}
}

export type RecipesActions = 
    SetRecipes 
    | FetchRecipes
    | AddRecipe
    | UpdateRecipe
    | DeleteRecipe
    | StoreRecipes
    | DeleteIngredient;