import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = []
  recipeChangedSubsription!: Subscription;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.recipeChangedSubsription = this.store.select('recipes')
      .pipe(
        map(recipesState => {
          return recipesState.recipes;
        })
      )
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }

  ngOnDestroy(): void {
    this.recipeChangedSubsription.unsubscribe();
  }
  
  onNewRecipeClicked() {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute});
  }

}
