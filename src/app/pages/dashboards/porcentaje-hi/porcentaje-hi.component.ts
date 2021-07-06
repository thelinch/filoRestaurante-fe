import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TipoIngresoLoteDetalle } from "src/app/enums/enumTipoIngresoLoteDetalle";
import { EnumLoading } from "src/app/models/estadoLoading";
import { LoteDetalleView } from "src/app/models/loteDetalle";
import { LoteDetalleRepositoryService } from "src/app/services/lote-detalle-repository.service";
import { ChartOptions } from "../default/dashboard.model";

@Component({
  selector: "app-porcentaje-hi",
  templateUrl: "./porcentaje-hi.component.html",
  styleUrls: ["./porcentaje-hi.component.scss"],
})
export class PorcentajeHiComponent implements OnInit {
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
    this.chartModelLineaHembra.dataLabels = { enabled: false };
    this.chartModelLineaMacho.dataLabels = { enabled: false };
    this.chartModelLineaHembra.stroke = {
      width: 5,
      dashArray: [5, 0],
      curve: "straight",
    };
    this.chartModelLineaMacho.stroke = {
      width: 5,
      dashArray: [5, 0],
      curve: "straight",
    };

    //this.chartModel.legend = { show: true, position: "bottom" };
    this.chartModelLineaHembra.tooltip = {
      enabled: true,
      shared: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return `<div class="arrow_box_grafica">
        <b>Semana ${w.globals.categoryLabels[dataPointIndex]}</b>
        <p><span style="color:red">●</span>% HI PROY:<b>${
          series[0][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:#87BCEE">●</span>% HI REAL:<b>${
          series[1][dataPointIndex] || 0
        }</b></p>
        </div>

        `;
      },
    };
    this.chartModelLineaMacho.markers = { size: [6, 2] };
    this.chartModelLineaHembra.markers = { size: [6, 2] };

    this.chartModelLineaMacho.tooltip = {
      enabled: true,
      shared: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return `<div class="arrow_box_grafica">
        <b>Semana ${w.globals.categoryLabels[dataPointIndex]}</b>
        <p><span style="color:red">●</span>% HI PROY:<b>${
          series[0][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:#87BCEE">●</span>% HI REAL:<b>${
          series[1][dataPointIndex] || 0
        }</b></p>
        </div>

        `;
      },
    };
    this.listaLoteDetalleView = [];
    this.chartModelLineaMacho.chart = {
      type: "line",
      height: "350",
    };
    this.chartModelLineaHembra.chart = { type: "line", height: "350" };

    this.chartModelLineaHembra.title = {
      text: "PORCENTAJE HI LINEA HEMBRA",
    };
    this.chartModelLineaMacho.title = {
      text: "PORCENTAJE HI LINEA MACHO",
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
      name: "% HI PROY",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaHembra.porcentajeHi).toFixed(2))
      ),
      color: "#FF0000",
    });
    this.chartModelLineaHembra.series.push({
      name: "% HI REAL",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaHembra.porcentajeHiReal).toFixed(2))
      ),
      color: "#87BCEE",
    });
    this.chartModelLineaMacho.series.push({
      name: "% HI PROY",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaMacho.porcentajeHi).toFixed(2))
      ),
      color: "#FF0000",
    });
    this.chartModelLineaMacho.series.push({
      name: "% HI REAL",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaMacho.porcentajeHiReal).toFixed(2))
      ),
      color: "#87BCEE",
    });
    this.chartModelLineaHembra.xaxis = { categories: semanas };
    this.chartModelLineaMacho.xaxis = { categories: semanas };
  }
}
