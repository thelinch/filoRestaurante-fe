import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccionesComponent } from "./acciones/acciones.component";
import { RolesComponent } from "./roles/roles.component";
import { UsuariosComponent } from "./usuarios/usuarios.component";

const routes: Routes = [
  { path: "roles", component: RolesComponent },
  { path: "usuarios", component: UsuariosComponent },
  { path: "acciones", component: AccionesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagmentUserRoutingModule {}
