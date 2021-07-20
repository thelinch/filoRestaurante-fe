import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrdersComponent } from "./orders/orders.component";
import { ArchwizardModule } from "angular-archwizard";
import { PublicRoutingModule } from "./public-routing.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [OrdersComponent],
  imports: [
    CommonModule,
    ArchwizardModule,
    PublicRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class PublicModule {}
