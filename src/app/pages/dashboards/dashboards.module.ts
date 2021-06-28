import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from './saas/shared/shared.module'
import { NgbDropdownModule, NgbTooltipModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { DefaultComponent } from './default/default.component';
import { SaasComponent } from './saas/saas.component';
import { CryptoComponent } from './crypto/crypto.component';
import { BlogComponent } from './blog/blog.component';
import { PorcentajeProduccionComponent } from './porcentaje-produccion/porcentaje-produccion.component';
import { PorcentajeHiComponent } from './porcentaje-hi/porcentaje-hi.component';
import { PorcentajeNacimientoComponent } from './porcentaje-nacimiento/porcentaje-nacimiento.component';
import { ComparativoHiComponent } from './comparativo-hi/comparativo-hi.component';
import { ComparativoBbsComponent } from './comparativo-bbs/comparativo-bbs.component';


@NgModule({
  declarations: [DefaultComponent, SaasComponent, CryptoComponent, BlogComponent, PorcentajeProduccionComponent, PorcentajeHiComponent, PorcentajeNacimientoComponent, ComparativoHiComponent, ComparativoBbsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    UIModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    WidgetModule,
    NgApexchartsModule,
    SharedModule,
    PerfectScrollbarModule
  ]
})
export class DashboardsModule { }
