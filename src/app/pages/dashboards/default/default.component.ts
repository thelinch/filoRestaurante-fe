import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject, Subscription } from "rxjs";
import StateDashboard from "./stateDashboard";
import { IngresoLote } from "src/app/models/IngresoLote";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import ItemsDashboard from "./itemsDashboard";
import { IngresoLoteService } from "src/app/services/ingreso-lote.service";

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit, OnDestroy {
  listaBotonesCategoria: Array<ItemsDashboard>;
  listaBotonesSubcategoria: Array<ItemsDashboard>;
  categoriaSeleccionado: ItemsDashboard;
  subcategoriaSeleccionado: ItemsDashboard;
  listaIngresoProduccion: Array<IngresoLote>;
  ingresoLoteSeleccionado: IngresoLote;
  llaveStorage = "estadoDashobard";

  private state: StateDashboard;
  search$: Subject<any> = new Subject();
  private subscriptionState: Subscription;
  mostrarLotes: boolean;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private ingresoLoteRepository: IngresoLoteService
  ) {
    this.listaIngresoProduccion = [];

    this.listaBotonesCategoria = [
      {
        nombre: "PRODUCCION",
        seleccionado: true,
        nombreProceso: "produccion",
        propiedad: "categoria",
        mostrarLotes: true,
      },
    ];
    this.listaBotonesSubcategoria = [
      {
        nombre: "Porcentaje Produccion",
        nombreProceso: "porcentajeProduccion",
        seleccionado: true,
        propiedad: "subcategoria",
        mostrarLotes: true,
      },
      {
        nombre: "Porcentaje Nacimiento",
        nombreProceso: "porcentajeNacimiento",
        seleccionado: false,
        propiedad: "subcategoria",
        mostrarLotes: true,
      },
      {
        nombre: "Porcentaje de HI",
        nombreProceso: "porcentajeHi",
        seleccionado: false,
        propiedad: "subcategoria",
        mostrarLotes: true,
      },

      {
        nombre: "#HI",
        nombreProceso: "comparativoHi",
        seleccionado: false,
        propiedad: "subcategoria",
        mostrarLotes: false,
      },
      {
        nombre: "#BBs",
        nombreProceso: "comparativoBbs",
        seleccionado: false,
        propiedad: "subcategoria",
        mostrarLotes: false,
      },
    ];
  }
  ngOnDestroy(): void {
    this.subscriptionState?.unsubscribe();
  }

  async ngOnInit() {
    await this.listarIngresoLote();
    const {
      state = {
        link: "",
        categoria: "",
        subcategoria: "",
        ingresoLoteSeleccionado: null,
      },
      categoriaSeleccionado = {},
      subcategoriaSeleccionado = { mostrarLotes: false },
      ingresoLoteSeleccionado = {},
    } = sessionStorage.getItem(this.llaveStorage)
      ? JSON.parse(sessionStorage.getItem(this.llaveStorage))
      : {};
    this.state = state;
    this.categoriaSeleccionado = categoriaSeleccionado;
    this.subcategoriaSeleccionado = subcategoriaSeleccionado;
    this.mostrarLotes = subcategoriaSeleccionado.mostrarLotes;
    this.ingresoLoteSeleccionado = ingresoLoteSeleccionado;
    this.subscriptionState = this.search$
      .pipe(
        debounceTime(90),
        distinctUntilChanged(),
        switchMap(() => this.renderizarComponente())
      )
      .subscribe();
  }

  async listarIngresoLote() {
    this.listaIngresoProduccion = (
      await this.ingresoLoteRepository.listar().toPromise()
    )
      .sort((a, b) => b.numeroIngreso - a.numeroIngreso)
      .map((ingresoLote) => ({ ...ingresoLote, seleccionado: false }));
  }
  nombreProcesoSubcategoria(itemDashboard: ItemsDashboard) {
    this.subcategoriaSeleccionado = itemDashboard;
    this.mostrarLotes = itemDashboard.mostrarLotes;
    const data = {};
    data[itemDashboard.propiedad] = itemDashboard.nombreProceso;
    this._set(data);
  }
  nombreProcesoCategoria(itemDashboard: ItemsDashboard) {
    this.categoriaSeleccionado = itemDashboard;
    const data = {};
    data[itemDashboard.propiedad] = itemDashboard.nombreProceso;
    this._set(data);
  }
  item(item: IngresoLote) {
    this.ingresoLoteSeleccionado = item;
    this._set({ ingresoLoteSeleccionado: item });
  }
  private _set(object: Partial<StateDashboard>) {
    Object.assign(this.state, object);
    this.search$.next(this.state[Object.keys(object)[0]]);
  }

  private async renderizarComponente() {
    if (!this.state.categoria || !this.state.subcategoria) {
      return;
    }
    sessionStorage.setItem(
      this.llaveStorage,
      JSON.stringify({
        ingresoLoteSeleccionado: this.ingresoLoteSeleccionado,
        categoriaSeleccionado: this.categoriaSeleccionado,
        subcategoriaSeleccionado: this.subcategoriaSeleccionado,
        state: this.state,
      })
    );
    if (
      this.subcategoriaSeleccionado.mostrarLotes &&
      this.state.ingresoLoteSeleccionado
    ) {
      //this.router.routeReuseStrategy.shouldReuseRoute = () => true;

      this.router.navigateByUrl(
        `/dashboards/${this.state.categoria}/${this.state.subcategoria}/${this.state.ingresoLoteSeleccionado.idProyIngresoLote}/grafica`
      );
    }
    if (!this.subcategoriaSeleccionado.mostrarLotes) {
      this.router.navigateByUrl(
        `/dashboards/${this.state.categoria}/${this.state.subcategoria}/grafica`
      );
    }
  }
}
