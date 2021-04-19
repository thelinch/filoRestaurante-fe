import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LotesComponent } from "./lotes/lotes.component";
import { ProjectionComponent } from "./projection/projection.component";

const routes: Routes = [
  {
    path: "lotes",
    component: LotesComponent,
  },
  {
    path: "proyeccion",
    component: ProjectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessRoutingModule {}
