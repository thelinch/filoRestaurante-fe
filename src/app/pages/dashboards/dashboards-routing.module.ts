import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefaultComponent } from "./default/default.component";
import { SaasComponent } from "./saas/saas.component";
import { CryptoComponent } from "./crypto/crypto.component";
import { BlogComponent } from "./blog/blog.component";
import { PorcentajeProduccionComponent } from "./porcentaje-produccion/porcentaje-produccion.component";
import { PorcentajeHiComponent } from "./porcentaje-hi/porcentaje-hi.component";
import { PorcentajeNacimientoComponent } from "./porcentaje-nacimiento/porcentaje-nacimiento.component";
import { ComparativoHiComponent } from "./comparativo-hi/comparativo-hi.component";
import { ComparativoBbsComponent } from "./comparativo-bbs/comparativo-bbs.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "produccion/porcentajeProduccion/:idProyingreso/grafica",
        component: PorcentajeProduccionComponent,
      },
      {
        path: "produccion/porcentajeHi/:idProyingreso/grafica",
        component: PorcentajeHiComponent,
      },
      {
        path: "produccion/porcentajeNacimiento/:idProyingreso/grafica",
        component: PorcentajeNacimientoComponent,
      },
      {
        path: "produccion/comparativoHi/grafica",
        component: ComparativoHiComponent,
      },
      {
        path: "produccion/comparativoBbs/grafica",
        component: ComparativoBbsComponent,
      },
    ],
  },
  {
    path: "saas",
    component: SaasComponent,
  },
  {
    path: "crypto",
    component: CryptoComponent,
  },
  {
    path: "blog",
    component: BlogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardsRoutingModule {}
