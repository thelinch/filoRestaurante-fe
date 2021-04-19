import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LotesComponent } from "./lotes/lotes.component";
import { ProcessRoutingModule } from "./process-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModuleCustom } from "src/app/common/common.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "src/app/core/helpers/jwt.interceptor";
import { LoaderInterceptorService } from "src/app/core/services/interceptors/loader-interceptor.service";
import { ProjectionComponent } from './projection/projection.component';

@NgModule({
  declarations: [LotesComponent, ProjectionComponent],
  imports: [
    CommonModule,
    ProcessRoutingModule,
    ReactiveFormsModule,
    CommonModuleCustom,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
  ],
})
export class ProcessModule {}
