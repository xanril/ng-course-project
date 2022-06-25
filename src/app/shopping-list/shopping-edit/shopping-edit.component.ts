import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { AppState } from 'src/app/store/app.reducer';
import * as ShopplingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') shoppingListForm!: NgForm;
  editMode: boolean = false;
  editedItem?: Ingredient;
  startEditingSubscription!: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    
    this.startEditingSubscription = this.store.select('shoppingList').subscribe(stateValue => {
      if (stateValue.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateValue.editedIngredient;
        this.shoppingListForm.setValue({
          name: this.editedItem?.name,
          amount: this.editedItem?.amount
        });
      }
      else {
        this.editMode = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.startEditingSubscription.unsubscribe();
    this.store.dispatch(new ShopplingListActions.StopEdit());
  }

  onSubmit(form: NgForm) {
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    if (this.editMode) {
      this.store.dispatch(new ShopplingListActions.UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new ShopplingListActions.AddIngredient(newIngredient));
    }

    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShopplingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShopplingListActions.DeleteIngredient());
    this.onClear();
  }
}
