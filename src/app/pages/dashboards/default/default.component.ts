import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import {
  emailSentBarChart,
  monthlyEarningChart,
  transactions,
  statData,
} from "./data";
import { ChartType } from "./dashboard.model";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import itemsDashboard from "./itemsDashboard";
import { Subject } from "rxjs";
import StateDashboard from "./stateDashboard";
import { IngresoLote } from "src/app/models/IngresoLote";
import { Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  listaBotonesCategoria: Array<itemsDashboard>;
  listaBotonesAccion: Array<itemsDashboard>;
  listaIngresoProduccion: Array<IngresoLote>;
  private state: StateDashboard;
  _search$: Subject<any> = new Subject();
  constructor(private modalService: NgbModal, private router: Router) {
    this.listaIngresoProduccion = [];
    this.state = { link: "", ingresoLoteSeleccionado: null };
    this.listaBotonesCategoria = [
      { nombre: "PRODUCCION", seleccionado: true, nombreProceso: "produccion" },
    ];
    this.listaBotonesAccion = [
      {
        nombre: "Porcentaje Produccion",
        nombreProceso: "porcentajeProduccion",
        seleccionado: true,
      },
      {
        nombre: "porcentaje Nacimiento",
        nombreProceso: "porcentajeNacimiento",
        seleccionado: false,
      },
      {
        nombre: "Hi",
        nombreProceso: "porcentajeHi",
        seleccionado: false,
      },
    ];
  }

  ngOnInit() {
    this._search$
      .pipe(
        debounceTime(90),
        distinctUntilChanged(),
        switchMap(() => this.renderizarComponente())
      )
      .subscribe();
    this.listarIngresoLote();
    /**
     * Fetches the data
     */
  }

  async listarIngresoLote() {}
  set nombreProceso(nombreProceso: string) {}
  private async renderizarComponente() {
    await this.router.navigate([this.state.link]);
  }
}
