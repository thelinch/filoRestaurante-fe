import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import {
  emailSentBarChart,
  monthlyEarningChart,
  transactions,
  statData,
} from "./data";
import { ChartType } from "./dashboard.model";
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
  private state: StateDashboard;
  search$: Subject<any> = new Subject();
  private subscriptionState: Subscription;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private ingresoLoteRepository: IngresoLoteService
  ) {
    console.log("efefef");
    this.listaIngresoProduccion = [];
    this.state = {
      link: "",
      categoria: "",
      subcategoria: "",
      ingresoLoteSeleccionado: null,
    };
    this.listaBotonesCategoria = [
      {
        nombre: "PRODUCCION",
        seleccionado: true,
        nombreProceso: "produccion",
        propiedad: "categoria",
      },
    ];
    this.listaBotonesSubcategoria = [
      {
        nombre: "Porcentaje Produccion",
        nombreProceso: "porcentajeProduccion",
        seleccionado: true,
        propiedad: "subcategoria",
      },
      {
        nombre: "porcentaje Nacimiento",
        nombreProceso: "porcentajeNacimiento",
        seleccionado: false,
        propiedad: "subcategoria",
      },
      {
        nombre: "Hi",
        nombreProceso: "porcentajeHi",
        seleccionado: false,
        propiedad: "subcategoria",
      },
    ];
    this.categoriaSeleccionado = {
      nombre: "PRODUCCION",
      seleccionado: true,
      nombreProceso: "produccion",
      propiedad: "categoria",
    };
  }
  ngOnDestroy(): void {
    this.subscriptionState?.unsubscribe();
  }

  ngOnInit() {
    this.subscriptionState = this.search$
      .pipe(
        debounceTime(90),
        distinctUntilChanged(),
        switchMap(() => this.renderizarComponente())
      )
      .subscribe();
    this.listarIngresoLote();
  }

  async listarIngresoLote() {
    console.log("ewntrio");
    this.listaIngresoProduccion = await this.ingresoLoteRepository
      .listar()
      .toPromise();
  }
  nombreProcesoSubcategoria(itemDashboard: ItemsDashboard) {
    this.subcategoriaSeleccionado = itemDashboard;
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
  async prueba() {
    await this.router.navigate(
      ["produccion", "porcentajeProduccion", 5, "grafica"],
      { relativeTo: this.route, skipLocationChange: false }
    );
  }
  private async renderizarComponente() {
    if (
      this.state.categoria &&
      this.state.categoria !== "" &&
      this.state.subcategoria &&
      this.state.subcategoria !== "" &&
      this.state.ingresoLoteSeleccionado
    ) {
      //this.router.routeReuseStrategy.shouldReuseRoute = () => true;

      this.router.navigateByUrl(
        `/dashboards/${this.state.categoria}/${this.state.subcategoria}/${this.state.ingresoLoteSeleccionado.idProyIngresoLote}/grafica`
      );
    }
  }
}
