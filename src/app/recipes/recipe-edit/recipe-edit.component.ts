import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import * as fromRecipes from '../store/recipes.reducer';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number = 0;
  editMode: boolean = false;
  recipeForm!: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router:Router,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(
        (params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;

          this.initForm();
        }
      );
  }

  initForm() {

    let recipeName = '';
    let recipeImagePath = ''
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if(this.editMode) {
      this.store.select('recipes').pipe(
        map((recipesState: fromRecipes.State) => {
          return recipesState.recipes.find((recipe: Recipe, index: number) => {
            return index === this.id;
          })
        })
      )
      .subscribe((recipe?: Recipe) => {
        recipeName = recipe?.name ?? '';
        recipeImagePath = recipe?.imagePath ?? '';
        recipeDescription = recipe?.description ?? '';

        recipeIngredients.clear();

        if(recipe != undefined && recipe['ingredients']) {
          for(let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              })
            );
          }
        }
      })
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.editMode = false;
    this.recipeForm.reset();
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.activatedRoute});
  }

  addIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        'name': new FormControl('', Validators.required),
        'amount': new FormControl('', [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
    this.recipeService.deleteIngredient(this.id, index);
  }

  getIngredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
}
