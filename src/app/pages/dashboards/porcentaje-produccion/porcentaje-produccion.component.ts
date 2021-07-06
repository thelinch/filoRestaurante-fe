import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChartComponent } from "ng-apexcharts";
import { TipoIngresoLoteDetalle } from "src/app/enums/enumTipoIngresoLoteDetalle";
import { ChartModel } from "src/app/models/ChartModel";
import { EnumLoading } from "src/app/models/estadoLoading";
import { LoteDetalleView } from "src/app/models/loteDetalle";
import { LoteDetalleRepositoryService } from "src/app/services/lote-detalle-repository.service";
import { EnumType } from "typescript";
import { ChartOptions } from "../default/dashboard.model";

@Component({
  selector: "app-porcentaje-produccion",
  templateUrl: "./porcentaje-produccion.component.html",
  styleUrls: ["./porcentaje-produccion.component.scss"],
})
export class PorcentajeProduccionComponent implements OnInit, AfterViewInit {
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
    this.chartModelLineaHembra.markers = { size: [6, 2] };
    this.chartModelLineaMacho.markers = { size: [6, 2] };

    this.chartModelLineaHembra.tooltip = {
      enabled: true,
      shared: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        let dataDif = 0;
        if (
          series[0][dataPointIndex] &&
          series[1][dataPointIndex] &&
          series[0][dataPointIndex] > 0
        ) {
          dataDif = Number(
            Number(
              ((series[1][dataPointIndex] - series[0][dataPointIndex]) /
                series[0][dataPointIndex]) *
                100
            ).toFixed(2)
          );
        }
        return `<div class="arrow_box_grafica">
        <b>Semana ${w.globals.categoryLabels[dataPointIndex]}</b>
        <p><span style="color:red">●</span>Proy Act_AveDia:<b>${
          series[0][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:#87BCEE">●</span>Act Ave/día:<b>${
          series[1][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:black">●</span>% DIF:<b>${dataDif}</b></p>
        </div>

        `;
      },
    };
    this.chartModelLineaMacho.tooltip = {
      enabled: true,
      shared: true,
      /*  formatter: function (tooltip) {
        return "";
      }, */
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        let dataDif = 0;

        if (
          series[0][dataPointIndex] &&
          series[1][dataPointIndex] &&
          series[0][dataPointIndex] > 0
        ) {
          dataDif = Number(
            Number(
              ((series[1][dataPointIndex] - series[0][dataPointIndex]) /
                series[0][dataPointIndex]) *
                100
            ).toFixed(2)
          );
        }
        return `<div class="arrow_box_grafica">
        <b>Semana ${w.globals.categoryLabels[dataPointIndex]}</b>
        <p><span style="color:red">●</span>Proy Act_AveDia:<b>${
          series[0][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:#87BCEE">●</span>Act Ave/día:<b>${
          series[1][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:black">●</span>% DIF:<b>${dataDif}</b></p>
        </div>

        `;
      },
    };

    //this.chartModel.legend = { show: true, position: "bottom" };
    this.listaLoteDetalleView = [];
    this.chartModelLineaMacho.chart = {
      type: "line",
      height: "350",
    };
    this.chartModelLineaHembra.chart = {
      type: "line",
      height: "350",
    };

    this.chartModelLineaHembra.title = {
      text: "PRODUCCION LINEA HEMBRA",
    };
    this.chartModelLineaMacho.title = {
      text: "PRODUCCION LINEA MACHO",
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
    console.log(this.listaLoteDetalleView);
    if (this.listaLoteDetalleView.length === 0) {
      this.chartModelLineaHembra.noData = { text: "Sin datos que mostrar" };
      this.chartModelLineaMacho.noData = { text: "Sin datos que mostrar" };
    }
    const semanas = this.listaLoteDetalleView.map((l) => l.semana);
    this.chartModelLineaHembra.series.push({
      name: "Proy Act_AveDia",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaHembra.porcentajePostura).toFixed(2))
      ),
      color: "#FF0000",
    });
    this.chartModelLineaHembra.series.push({
      name: "Act Ave/día",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaHembra.porcentajePosturaReal).toFixed(2))
      ),
      color: "#87BCEE",
    });
    this.chartModelLineaMacho.series.push({
      name: "Proy Act_AveDia",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaMacho.porcentajePostura).toFixed(2))
      ),
      color: "#FF0000",
    });
    this.chartModelLineaMacho.series.push({
      name: "Act Ave/día",
      data: this.listaLoteDetalleView.map((l) =>
        Number(Number(l.lineaMacho.porcentajePosturaReal).toFixed(2))
      ),
      color: "#87BCEE",
    });

    this.chartModelLineaHembra.xaxis = { categories: semanas };
    this.chartModelLineaMacho.xaxis = { categories: semanas };
  }
}
