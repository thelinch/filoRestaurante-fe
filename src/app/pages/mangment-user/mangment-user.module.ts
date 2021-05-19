import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RolesComponent } from "./roles/roles.component";
import { AccionesComponent } from "./acciones/acciones.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";
import { ManagmentUserRoutingModule } from "./managment-user-routing.module";
import { JwtInterceptor } from "src/app/core/helpers/jwt.interceptor";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CommonModuleCustom } from "src/app/common/common.module";
import { ReactiveFormsModule } from "@angular/forms";
import { LoaderInterceptorService } from "src/app/core/services/interceptors/loader-interceptor.service";

@NgModule({
  declarations: [RolesComponent, AccionesComponent, UsuariosComponent],
  imports: [
    CommonModule,
    ManagmentUserRoutingModule,
    CommonModuleCustom,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },

  ],
})
export class MangmentUserModule {}
