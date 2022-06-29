import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "./order/order.component";
import { SalesComponent } from "./sales/sales.component";
import { OrderHandlingRoutingModule } from "./order-handling-routing.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DndModule } from "ngx-drag-drop";
import { OrderDetailFormComponent } from "./components/order-detail-form/order-detail-form.component";
import {
  NgbCollapseModule,
  NgbModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxPermissionsModule } from "ngx-permissions";
import { ProcessOrderComponent } from "./components/process-order/process-order.component";

@NgModule({
  declarations: [
    OrderComponent,
    SalesComponent,
    OrderDetailFormComponent,
    ProcessOrderComponent,
  ],

  imports: [
    NgxPermissionsModule.forChild(),
    CommonModule,
    NgbNavModule,
    OrderHandlingRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DndModule,
  ],
})
export class OrderHandlingModule {}
