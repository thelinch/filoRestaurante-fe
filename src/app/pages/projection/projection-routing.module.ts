import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FactorComponent } from "./factor/factor.component";
import { ProjectionStandardFemaleComponent } from "./projection-standard-female/projection-standard-female.component";
import { ProjectionStandardMaleComponent } from "./projection-standard-male/projection-standard-male.component";

const routes: Routes = [
  { path: "proyeccionHembras", component: ProjectionStandardFemaleComponent },
  { path: "proyeccionMacho", component: ProjectionStandardMaleComponent },
  { path: "factor", component: FactorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectionRoutingModule {}
