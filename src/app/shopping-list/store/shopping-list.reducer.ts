import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

const initialState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ]
}

export function shoppingListReducer(
    state = initialState,
    action: ShoppingListActions.ShoppingListActions) : { ingredients: Ingredient[] } {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    action.payload as Ingredient
                ]
            };

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    ...action.payload as Ingredient[]
                ]
            };

        default:
            return state;
    }
}