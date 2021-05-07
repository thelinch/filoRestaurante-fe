import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableCustomGenericComponent } from "./table-custom-generic/table-custom-generic.component";
import {
  NgbCollapseModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SafeHtmlPipe } from "./table-custom-generic/safe-html.pipe";
import { EstadosDirective } from "./directivas/estados.directive";
import { OrdersFormComponent } from "./forms/orders-form/orders-form.component";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [
    TableCustomGenericComponent,
    SafeHtmlPipe,
    EstadosDirective,
    OrdersFormComponent,
  ],
  imports: [
    CommonModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
  ],
  exports: [TableCustomGenericComponent, EstadosDirective, OrdersFormComponent],
})
export class CommonModuleCustom {}
