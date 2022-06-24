import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT: string = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS: string = 'ADD_INGREDIENTS';

export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;
    payload?:Ingredient;

    constructor(payload?: Ingredient) {
        this.payload = payload;
    }
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;
    payload?:Ingredient[];

    constructor(payload?: Ingredient[]) {
        this.payload = payload;
    }
}

export type ShoppingListActions = AddIngredient | AddIngredients;