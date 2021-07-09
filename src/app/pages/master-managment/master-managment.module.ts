import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TablesComponent } from "./tables/tables.component";
import { CommonModuleCustom } from "src/app/common/common.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MasterManagmentRoutingModule } from "./master-managment-routing.module";

@NgModule({
  declarations: [TablesComponent],
  imports: [
    CommonModule,
    CommonModuleCustom,
    FormsModule,
    ReactiveFormsModule,
    MasterManagmentRoutingModule,
  ],
})
export class MasterManagmentModule {}
