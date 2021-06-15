import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TipoIngresoLoteDetalle } from "src/app/enums/enumTipoIngresoLoteDetalle";
import { EnumLoading } from "src/app/models/estadoLoading";
import { LoteDetalleView } from "src/app/models/loteDetalle";
import { LoteDetalleRepositoryService } from "src/app/services/lote-detalle-repository.service";
import { ChartOptions } from "../default/dashboard.model";

@Component({
  selector: "app-porcentaje-nacimiento",
  templateUrl: "./porcentaje-nacimiento.component.html",
  styleUrls: ["./porcentaje-nacimiento.component.scss"],
})
export class PorcentajeNacimientoComponent implements OnInit {
  private listaLoteDetalleView: Array<LoteDetalleView>;
  stateLoading: EnumLoading = EnumLoading.cargando;
  chartModelLineaHembra: Partial<ChartOptions> = {};
  chartModelLineaMacho: Partial<ChartOptions> = {};

  constructor(
    private loteDetalleRepository: LoteDetalleRepositoryService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(({ idProyingreso: idProyingresoId }) => {
      this.generarGrafico(idProyingresoId);
    });
    this.chartModelLineaMacho.series = [];
    this.chartModelLineaHembra.series = [];
    this.chartModelLineaHembra.dataLabels = { enabled: true };
    this.chartModelLineaMacho.dataLabels = { enabled: true };
    this.chartModelLineaHembra.stroke = {
      curve: "smooth",
    };
    this.chartModelLineaMacho.stroke = {
      curve: "smooth",
    };

    //this.chartModel.legend = { show: true, position: "bottom" };
    this.listaLoteDetalleView = [];
    this.chartModelLineaMacho.chart = {
      type: "line",
      height: "350",
    };

    this.chartModelLineaHembra.chart = { type: "line", height: "350" };

    this.chartModelLineaHembra.title = {
      text: "PORCENTAJE NACIMIENTO LINEA HEMBRA EN MILES",
    };
    this.chartModelLineaMacho.title = {
      text: "PORCENTAJE NACIMIENTO LINEA MACHO EN MILES",
    };
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  async listarLoteDetallePorIngreso(ingresoId: number) {
    return await this.loteDetalleRepository
      .listarDetallePorIngresoLote(ingresoId)
      .toPromise();
  }

  async generarGrafico(ingresoLoteId: number) {
    this.chartModelLineaMacho.series = [];
    this.chartModelLineaHembra.series = [];
    this.chartModelLineaHembra.noData = { text: "Cargando..." };
    this.chartModelLineaMacho.noData = { text: "Cargando..." };

    this.listaLoteDetalleView = (
      await this.listarLoteDetallePorIngreso(ingresoLoteId)
    ).filter((a) => (a.tipo = TipoIngresoLoteDetalle.Produccion));
    if (this.listaLoteDetalleView.length === 0) {
      this.chartModelLineaHembra.noData = { text: "Sin datos que mostrar" };
      this.chartModelLineaMacho.noData = { text: "Sin datos que mostrar" };
    }
    const semanas = this.listaLoteDetalleView.map((l) => l.semana);
    this.chartModelLineaHembra.series.push({
      name: "Nac Act_AveDia",
      data: this.listaLoteDetalleView.map((l) =>
        Number((l.lineaHembra.porcentajeNacimiento / 1000).toFixed(1))
      ),
      color: "#FF0000",
    });
    this.chartModelLineaHembra.series.push({
      name: "Act Ave/día",
      data: this.listaLoteDetalleView.map((l) =>
        Number((l.lineaHembra.porcentajeNacimientoReal / 1000).toFixed(1))
      ),
      color: "#87BCEE",
    });
    this.chartModelLineaMacho.series.push({
      name: "Nac Act_AveDia",
      data: this.listaLoteDetalleView.map((l) =>
        Number((l.lineaMacho.porcentajeNacimiento / 1000).toFixed(1))
      ),
      color: "#FF0000",
    });
    this.chartModelLineaMacho.series.push({
      name: "Act Ave/día",
      data: this.listaLoteDetalleView.map((l) =>
        Number((l.lineaMacho.porcentajeNacimientoReal / 1000).toFixed(1))
      ),
      color: "#87BCEE",
    });
    this.chartModelLineaHembra.xaxis = { categories: semanas };
    this.chartModelLineaMacho.xaxis = { categories: semanas };
  }
}
