import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoriesComponent } from "./categories/categories.component";
import { ProductComponent } from "./product/product.component";
import { TablesComponent } from "./tables/tables.component";

const routes: Routes = [
  { path: "tables", component: TablesComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "products", component: ProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterManagmentRoutingModule {}
