import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TablesComponent } from "./tables/tables.component";

const routes: Routes = [{ path: "tables", component: TablesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterManagmentRoutingModule {}
