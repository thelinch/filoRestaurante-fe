import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoriesComponent } from "./categories/categories.component";
import { TablesComponent } from "./tables/tables.component";

const routes: Routes = [
  { path: "tables", component: TablesComponent },
  { path: "categories", component: CategoriesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterManagmentRoutingModule {}
