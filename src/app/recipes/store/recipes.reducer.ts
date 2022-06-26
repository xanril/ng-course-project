import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipes.actions";

export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes: []
};

export function recipesReducer(state: State = initialState, action: RecipesActions.RecipesActions) {
    
    switch(action.type) {
        case RecipesActions.SET_RECIPES:
            const setRecipesAction = action as RecipesActions.SetRecipes;
            return {
                ...state,
                recipes: [...setRecipesAction.payload ?? []]
            }

        default:
            return state;
    }
}