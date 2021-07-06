import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { LoaderService } from "src/app/core/services/loader.service";
import { ComparativoHiBbsProyectadoReal } from "src/app/models/comparativoHiBbsProyectadoReal";
import { EnumLoading } from "src/app/models/estadoLoading";
import { ChartOptions } from "../default/dashboard.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-comparativo-hi",
  templateUrl: "./comparativo-hi.component.html",
  styleUrls: ["./comparativo-hi.component.scss"],
})
export class ComparativoHiComponent implements OnInit {
  stateLoading: EnumLoading = EnumLoading.cargando;
  chartModelLineaHembra: Partial<ChartOptions> = {};
  chartModelLineaMacho: Partial<ChartOptions> = {};
  formularioFiltracion: FormGroup;
  isLoadingForms: Observable<boolean>;
  listaComparativoHiBbsReal: ComparativoHiBbsProyectadoReal[];
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private http: HttpClient
  ) {
    this.isLoadingForms = loaderService.isLoading;
    this.chartModelLineaMacho.series = [];
    this.chartModelLineaHembra.series = [];
    this.chartModelLineaHembra.dataLabels = { enabled: false };
    this.chartModelLineaMacho.dataLabels = { enabled: false };
    this.chartModelLineaHembra.tooltip = {
      enabled: true,
      shared: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return `<div class="arrow_box_grafica">
        <b>Semana ${w.globals.categoryLabels[dataPointIndex]}</b>
        <p><span >●</span>FECHA:<b>${
          this.listaComparativoHiBbsReal[dataPointIndex].fecha || 0
        }</b></p>
        <p><span style="color:red">●</span>#HI PROY:<b>${
          series[0][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:#87BCEE">●</span>#HI REAL:<b>${
          series[1][dataPointIndex] || 0
        }</b></p>
        </div>

        `;
      },
    };
    this.chartModelLineaMacho.tooltip = {
      enabled: true,
      shared: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return `<div class="arrow_box_grafica">
        <b>Semana ${w.globals.categoryLabels[dataPointIndex]}</b>
        <p><span >●</span>FECHA:<b>${
          this.listaComparativoHiBbsReal[dataPointIndex].fecha || 0
        }</b></p>
        <p><span style="color:red">●</span> #HI PROY:<b>${
          series[0][dataPointIndex] || 0
        }</b></p>
        <p><span style="color:#87BCEE">●</span>#HI REAL:<b>${
          series[1][dataPointIndex] || 0
        }</b></p>
        
        </div>

        `;
      },
    };
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
    this.chartModelLineaMacho.markers = { size: [6, 2] };
    this.chartModelLineaHembra.markers = { size: [6, 2] };

    this.listaComparativoHiBbsReal = [];
    this.chartModelLineaMacho.chart = {
      type: "line",
      height: "350",
    };
    this.chartModelLineaHembra.chart = { type: "line", height: "350" };

    this.chartModelLineaHembra.title = {
      text: "CURVA DE #HI -LINEA HEMBRA",
    };
    this.chartModelLineaMacho.title = {
      text: "CURVA DE #HI -LINEA MACHO",
    };
  }

  ngOnInit(): void {
    this.crearFormulario();
  }

  crearFormulario() {
    this.formularioFiltracion = this.fb.group({
      anio: ["", [Validators.required]],
    });
  }
  get formularioFiltracionControles() {
    return this.formularioFiltracion.controls;
  }

  async generarGrafico() {
    this.chartModelLineaMacho.series = [];
    this.chartModelLineaHembra.series = [];
    this.chartModelLineaHembra.noData = { text: "Cargando..." };
    this.chartModelLineaMacho.noData = { text: "Cargando..." };
    this.listaComparativoHiBbsReal = await this.http
      .post<ComparativoHiBbsProyectadoReal[]>(
        environment.apiUrl + "/pedidoVenta/graficaHiBbsRealProyectado",
        this.formularioFiltracion.value
      )
      .toPromise();
    const semanas = this.listaComparativoHiBbsReal
      .map((l) => l.semana)
      .reduce((prev, curr) => {
        if (prev.findIndex((p) => p === curr) == -1) {
          prev.push(curr);
        }
        return prev;
      }, []);
    const lineaHembra = this.listaComparativoHiBbsReal.filter(
      (l) => l.tipoGenero == "LH"
    );
    const lineaMacho = this.listaComparativoHiBbsReal.filter(
      (l) => l.tipoGenero == "LM"
    );
    if (this.listaComparativoHiBbsReal.length === 0) {
      this.chartModelLineaHembra.noData = { text: "Sin datos que mostrar" };
      this.chartModelLineaMacho.noData = { text: "Sin datos que mostrar" };
    }
    this.chartModelLineaHembra.series.push({
      name: "#HI PROY",
      data: lineaHembra.map((l) => l.hiProyectado),
      color: "#FF0000",
    });
    this.chartModelLineaHembra.series.push({
      name: "#HI REAL",
      data: lineaHembra.map((l) => l.hiReal),
      color: "#87BCEE",
    });
    this.chartModelLineaMacho.series.push({
      name: "#HI PROY",
      data: lineaMacho.map((l) => l.hiProyectado),
      color: "#FF0000",
    });
    this.chartModelLineaMacho.series.push({
      name: "#HI REAL",
      data: lineaMacho.map((l) => l.hiReal),
      color: "#87BCEE",
    });
    this.chartModelLineaHembra.xaxis = { categories: semanas };
    this.chartModelLineaMacho.xaxis = { categories: semanas };
  }
}
