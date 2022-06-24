import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

export interface State {
    ingredients: Ingredient[];
    editedIngredient?: Ingredient;
    editedIngredientIndex: number;
}

export interface AppState {
    shoppingList: State;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
    editedIngredient: undefined,
    editedIngredientIndex: -1
}

export function shoppingListReducer(
    state: State = initialState,
    action: ShoppingListActions.ShoppingListActions) {

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

        case ShoppingListActions.UPDATE_INGREDIENT:

            const typedAction = action as ShoppingListActions.UpdateIngredient;
            const targetIngredient = state.ingredients[typedAction.index];
            const updatedIngredient = {
                ...targetIngredient,
                ...typedAction.newIngredient
            }

            const updatedIngredients = [...state.ingredients];
            updatedIngredients[typedAction.index] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients
            };

        case ShoppingListActions.DELETE_INGREDIENT:
            
            const deleteAction = action as ShoppingListActions.DeleteIngredient;

            return {
                ...state,
                ingredients: state.ingredients.filter( (ig, index) => {
                    return index !== deleteAction.index;
                })
            };

        case ShoppingListActions.START_EDIT:

            const startEditAction = action as ShoppingListActions.StartEdit;

            return {
                ...state,
                editedIngredientIndex: startEditAction.index,
                editedIngredient: { ...state.ingredients[startEditAction.index] }
            }

        case ShoppingListActions.STOP_EDIT:

            return {
                ...state,
                editedIngredientIndex: -1,
                editedIngredient: undefined
            }

        default:
            return state;
    }
}