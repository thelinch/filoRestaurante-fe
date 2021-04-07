import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableCustomGenericComponent } from "./table-custom-generic/table-custom-generic.component";
import {
  NgbCollapseModule,
  NgbPaginationModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { SafeHtmlPipe } from './table-custom-generic/safe-html.pipe';

@NgModule({
  declarations: [TableCustomGenericComponent, SafeHtmlPipe],
  imports: [
    CommonModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    FormsModule,
  ],
  exports: [TableCustomGenericComponent],
})
export class CommonModuleCustom {}
