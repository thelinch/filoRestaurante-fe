import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProjectionStandardFemaleComponent } from "./projection-standard-female/projection-standard-female.component";
import { ProjectionStandardMaleComponent } from "./projection-standard-male/projection-standard-male.component";
import { ProjectionRoutingModule } from "./projection-routing.module";
import { CommonModuleCustom } from "src/app/common/common.module";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { JwtInterceptor } from "src/app/core/helpers/jwt.interceptor";
import { LoaderInterceptorService } from "src/app/core/services/interceptors/loader-interceptor.service";
import { FactorComponent } from "./factor/factor.component";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [
    ProjectionStandardFemaleComponent,
    ProjectionStandardMaleComponent,
    FactorComponent,
  ],
  imports: [
    CommonModule,
    ProjectionRoutingModule,
    CommonModuleCustom,
    ReactiveFormsModule,
    NgSelectModule,
  ],
/*   providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
  ], */
})
export class ProjectionModule {}
