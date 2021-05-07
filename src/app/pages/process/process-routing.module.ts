import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrdersComponent } from "./orders/orders.component";
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
  {
    path: "pedidos",
    component: OrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessRoutingModule {}
