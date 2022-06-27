import { Ingredient } from "src/app/shared/ingredient.model";
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
            };

        case RecipesActions.ADD_RECIPE:
            const addRecipeAction = action as RecipesActions.AddRecipe;
            return {
                ...state,
                recipes: [...state.recipes, addRecipeAction.payload!]
            };

        case RecipesActions.UPDATE_RECIPE:
            const updateRecipeAction = action as RecipesActions.UpdateRecipe;
            const updatedRecipe = {
                ...state.recipes[updateRecipeAction.payload!.index],
                ...updateRecipeAction.payload!.recipe
            };

            const updatedRecipes = [...state.recipes];
            updatedRecipes[updateRecipeAction.payload!.index] = updatedRecipe;

            return {
                ...state,
                recipes: updatedRecipes
            };

        case RecipesActions.DELETE_RECIPE:
            const deleteRecipeAction = action as RecipesActions.DeleteRecipe;
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => {
                    return index !== deleteRecipeAction.payload!;
                })
            };

        case RecipesActions.DELETE_INGREDIENT:
            const deleteIngredientAction = action as RecipesActions.DeleteIngredient;

            const targetRecipe = state.recipes[deleteIngredientAction.payload!.recipeIndex];
            const editedRecipe: Recipe = {
                ...state.recipes[deleteIngredientAction.payload!.recipeIndex],
                ingredients: targetRecipe.ingredients.filter((ig, index) =>{
                    return index !== deleteIngredientAction.payload!.ingredientIndex;
                })
            };

            var editedRecipes = [...state.recipes];
            editedRecipes[deleteIngredientAction.payload!.recipeIndex] = editedRecipe;
                
            return {
                ...state,
                recipes: editedRecipes
            };
            
        default:
            return state;
    }
}