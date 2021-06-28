import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { LoaderService } from "src/app/core/services/loader.service";
import { ComparativoHiBbsProyectadoReal } from "src/app/models/comparativoHiBbsProyectadoReal";
import { EnumLoading } from "src/app/models/estadoLoading";
import { environment } from "src/environments/environment";
import { ChartOptions } from "../default/dashboard.model";

@Component({
  selector: "app-comparativo-bbs",
  templateUrl: "./comparativo-bbs.component.html",
  styleUrls: ["./comparativo-bbs.component.scss"],
})
export class ComparativoBbsComponent implements OnInit {
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
    this.chartModelLineaHembra.dataLabels = { enabled: true };
    this.chartModelLineaMacho.dataLabels = { enabled: true };
    this.chartModelLineaHembra.stroke = {
      curve: "smooth",
    };
    this.chartModelLineaMacho.stroke = {
      curve: "smooth",
    };

    this.listaComparativoHiBbsReal = [];
    this.chartModelLineaMacho.chart = {
      type: "line",
      height: "350",
    };
    this.chartModelLineaHembra.chart = { type: "line", height: "350" };

    this.chartModelLineaHembra.title = {
      text: "CURVA DE #BBS -LINEA HEMBRA",
    };
    this.chartModelLineaMacho.title = {
      text: "CURVA DE #BBS -LINEA MACHO",
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
      name: "Hi Proyectado",
      data: lineaHembra.map((l) => l.bbsProyectado),
      color: "#FF0000",
    });
    this.chartModelLineaHembra.series.push({
      name: "Hi Real",
      data: lineaHembra.map((l) => l.bbsReal),
      color: "#87BCEE",
    });
    this.chartModelLineaMacho.series.push({
      name: "Hi Proyectado",
      data: lineaMacho.map((l) => l.bbsProyectado),
      color: "#FF0000",
    });
    this.chartModelLineaMacho.series.push({
      name: "Hi Real",
      data: lineaMacho.map((l) => l.bbsReal),
      color: "#87BCEE",
    });
    this.chartModelLineaHembra.xaxis = { categories: semanas };
    this.chartModelLineaMacho.xaxis = { categories: semanas };
  }
}
