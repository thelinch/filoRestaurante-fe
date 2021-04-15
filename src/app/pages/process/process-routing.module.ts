import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LotesComponent } from "./lotes/lotes.component";

const routes: Routes = [
  {
    path: "lotes",
    component: LotesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessRoutingModule {}
