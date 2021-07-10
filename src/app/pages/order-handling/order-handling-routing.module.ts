import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrderComponent } from "./order/order.component";
import { SalesComponent } from "./sales/sales.component";

const routes: Routes = [
  { path: "sales", component: SalesComponent },
  { path: "orders", component: OrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderHandlingRoutingModule {}
