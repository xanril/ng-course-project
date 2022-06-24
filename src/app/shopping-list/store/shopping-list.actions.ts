import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT: string = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS: string = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT: string = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT: string = 'DELETE_INGREDIENT';
export const START_EDIT: string = 'START_EDIT';
export const STOP_EDIT: string = 'STOP_EDIT';

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

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;
    payload?:Ingredient;

    constructor(public index: number,
        public newIngredient: Ingredient) {}
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
    payload?:Ingredient;

    constructor(public index: number) { }
}

export class StartEdit implements Action {
    readonly type = START_EDIT;
    payload?: Ingredient;

    constructor(public index: number) {}
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
    payload?: Ingredient;
}

export type ShoppingListActions = 
    AddIngredient 
    | AddIngredients 
    | UpdateIngredient 
    | DeleteIngredient
    | StartEdit
    | StopEdit;