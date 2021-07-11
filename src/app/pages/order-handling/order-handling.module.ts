import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "./order/order.component";
import { SalesComponent } from "./sales/sales.component";
import { OrderHandlingRoutingModule } from "./order-handling-routing.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule } from "@angular/forms";
import { DndModule } from "ngx-drag-drop";

@NgModule({
  declarations: [OrderComponent, SalesComponent],

  imports: [
    CommonModule,
    OrderHandlingRoutingModule,
    NgSelectModule,
    FormsModule,
    DndModule
  ],
})
export class OrderHandlingModule {}
