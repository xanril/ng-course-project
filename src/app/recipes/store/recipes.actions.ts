import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const SET_RECIPES: string = '[Recipes] Set Recipes';

export class SetRecipes implements Action {
    readonly type = SET_RECIPES;
    payload?:Recipe[];

    constructor(payload: Recipe[]) {
        this.payload = payload;
    }
}

export type RecipesActions = SetRecipes;