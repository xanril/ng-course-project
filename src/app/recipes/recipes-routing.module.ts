import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../auth/auth-guard.service";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeResolverService } from "./recipe-resolver.service";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";

const recipesRoutes: Routes = [
    {
        path: 'recipes', component: RecipesComponent,
        canActivate: [AuthGuardService],
        children: [
            { path: '', component: RecipeStartComponent, pathMatch: 'full' },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailComponent, resolve: {recipe: RecipeResolverService} },
            { path: ':id/edit', component: RecipeEditComponent }
        ]
    },
]

@NgModule({
    imports:[RouterModule.forChild(recipesRoutes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule {}