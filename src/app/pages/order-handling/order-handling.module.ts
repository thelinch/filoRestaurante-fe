import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { SalesComponent } from './sales/sales.component';



@NgModule({
  declarations: [OrderComponent, SalesComponent],
  imports: [
    CommonModule
  ]
})
export class OrderHandlingModule { }
