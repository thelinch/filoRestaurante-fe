import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "./order/order.component";
import { SalesComponent } from "./sales/sales.component";
import { OrderHandlingRoutingModule } from "./order-handling-routing.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DndModule } from "ngx-drag-drop";
import { OrderDetailFormComponent } from "./components/order-detail-form/order-detail-form.component";
import { NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [OrderComponent, SalesComponent, OrderDetailFormComponent],

  imports: [
    CommonModule,
    OrderHandlingRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DndModule,
  ],
})
export class OrderHandlingModule {}
