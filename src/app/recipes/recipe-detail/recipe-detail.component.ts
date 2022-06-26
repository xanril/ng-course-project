import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipes from '../store/recipes.reducer';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe?: Recipe
  recipeIndex: number = 0;

  constructor(private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute,
    private router:Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {

    this.activatedRoute.params.pipe(
      map((params: Params) => {
        return +params['id'];
      }),
      switchMap((id: number) => {
        this.recipeIndex = id;
        return this.store.select('recipes');
      }),
      map((recipesState: fromRecipes.State) => {
        return recipesState.recipes.find((recipe: Recipe, index: number) => {
          return index === this.recipeIndex;
        })
      })
    )
    .subscribe((recipe?: Recipe) => {
      this.recipe = recipe;
    });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe?.ingredients ?? []);
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeIndex);
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }
}
