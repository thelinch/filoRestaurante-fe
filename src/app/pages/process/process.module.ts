import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LotesComponent } from "./lotes/lotes.component";
import { ProcessRoutingModule } from "./process-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModuleCustom } from "src/app/common/common.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoaderInterceptorService } from "src/app/core/services/interceptors/loader-interceptor.service";
import { ProjectionComponent } from "./projection/projection.component";
import { OrdersComponent } from "./orders/orders.component";
import { TotlaIncomeComponent } from "./totla-income/totla-income.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

@NgModule({
  declarations: [
    LotesComponent,
    ProjectionComponent,
    OrdersComponent,
    TotlaIncomeComponent,
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    ReactiveFormsModule,
    CommonModuleCustom,
    NgxSkeletonLoaderModule,
  ],
  providers: [],
})
export class ProcessModule {}
