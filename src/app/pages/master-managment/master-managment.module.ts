import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TablesComponent } from "./tables/tables.component";
import { CommonModuleCustom } from "src/app/common/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MasterManagmentRoutingModule } from "./master-managment-routing.module";
import { CategoriesComponent } from './categories/categories.component';
import { ProductComponent } from './product/product.component';
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [TablesComponent, CategoriesComponent, ProductComponent],
  imports: [
    CommonModule,
    CommonModuleCustom,
    FormsModule,
    ReactiveFormsModule,
    MasterManagmentRoutingModule,
    NgSelectModule,

  ],
})
export class MasterManagmentModule {}
