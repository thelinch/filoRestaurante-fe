import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { LoaderService } from "src/app/core/services/loader.service";
import { IngresoLote } from "src/app/models/IngresoLote";
import { LoteDetalleView } from "src/app/models/loteDetalle";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-projection",
  templateUrl: "./projection.component.html",
  styleUrls: ["./projection.component.scss"],
})
export class ProjectionComponent implements OnInit {
  formularioEdicionFactorProduccion: FormGroup;
  isLoading: Observable<boolean>;
  @ViewChild("editFactorProduccion")
  modalFormularioFactorProduccion: TemplateRef<any>;
  @ViewChild("listaProyLoteDetalle")
  modalListaProyLoteDetalle: TemplateRef<any>;
  @ViewChild("listaProyLoteDetalleConDatosReales")
  modalListaLoteDetalleReales: TemplateRef<any>;
  ingresoLoteSeleccionado: IngresoLote;
  listaLoteDetallePorIngresoLote: Array<LoteDetalleView>;
  listaDeLotes: Array<IngresoLote>;
  mostrarCargaEdicionLoteDetalle: boolean;
  mostrarCargaProyeccion: boolean;
  listaProyLoteFila: Array<any> = [];
  cargaListaLotes: boolean;
  cargaComparativo: boolean;
  cargaExportacionExcelDetalle: boolean;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loadingService: LoaderService,
    private modalService: NgbModal
  ) {
    this.isLoading = loadingService.isLoading;
    this.listaLoteDetallePorIngresoLote = [];
    this.mostrarCargaEdicionLoteDetalle = false;
    this.mostrarCargaProyeccion = false;
    this.cargaListaLotes = true;
    this.cargaComparativo = false;
    this.cargaExportacionExcelDetalle = false;
  }

  ngOnInit(): void {
    this.crearFormularioFactorProduccion();
    this.listarLotes();
    this.formularioEdicionFactorProduccion
      .get("genero")
      .valueChanges.pipe(filter((f) => f))
      .subscribe(async (genero: string) => {
        this.listaProyLoteFila = await this.http
          .get<Array<any>>(
            environment.apiUrl +
              "/proyLoteDetalle/listarSemanas/ingresoLote/" +
              this.ingresoLoteSeleccionado.idProyIngresoLote +
              "/tipoGenero/" +
              genero
          )
          .toPromise();
      });
    this.formularioEdicionFactorProduccion
      .get("semana")
      .valueChanges.subscribe((loteDetalle) => {
        if (loteDetalle) {
          this.formularioEdicionFactorProduccion.patchValue({
            id: loteDetalle.id,
            porcentajeHi: loteDetalle.porcentajeHi,
            porcentajePostura: loteDetalle.porcentajePostura,
            porcentajeNacimiento: loteDetalle.porcentajeNacimiento,
          });
        }
      });
  }
  openModalFormularioEdicionFactorProduccion(ingresoLote: IngresoLote) {
    this.ingresoLoteSeleccionado = ingresoLote;
    this.formularioEdicionFactorProduccion.reset();
    this.listaProyLoteFila = [];
    this.modalService.open(this.modalFormularioFactorProduccion);
  }
  crearFormularioFactorProduccion() {
    this.formularioEdicionFactorProduccion = this.fb.group({
      id: [0],
      genero: [null, [Validators.required]],
      porcentajePostura: [null, [Validators.required]],
      porcentajeHi: [null, [Validators.required]],
      porcentajeNacimiento: [null, [Validators.required]],
      semana: [null, [Validators.required]],
    });
  }
  async listarLotes() {
    this.cargaListaLotes = true;
    this.listaDeLotes = await this.http
      .get<Array<IngresoLote>>(environment.apiUrl + "/proyIngresoLote")
      .toPromise();
    this.cargaListaLotes = false;
  }
  async editarLoteDetalle(loteDetalle: any) {
    this.formularioEdicionFactorProduccion.markAllAsTouched();
    if (this.formularioEdicionFactorProduccion.invalid) {
      return;
    }
    await this.http
      .post(
        environment.apiUrl +
          "/proyLoteDetalle/editar/" +
          this.ingresoLoteSeleccionado.idProyIngresoLote,
        loteDetalle
      )
      .toPromise();
    this.modalService.dismissAll();
  }
  get formularioEdicionFactorProduccionControles() {
    return this.formularioEdicionFactorProduccion.controls;
  }
  async listarProyeccionDetalle(ingresoLote: IngresoLote) {
    this.ingresoLoteSeleccionado = ingresoLote;
    this.listaLoteDetallePorIngresoLote = await this.http
      .get<Array<LoteDetalleView>>(
        environment.apiUrl +
          "/proyLoteDetalle/listar/" +
          ingresoLote.idProyIngresoLote
      )
      .toPromise();
    this.modalService.open(this.modalListaProyLoteDetalle, { size: "xl" });
  }

  async generarComparativo(ingresoLote: IngresoLote) {
    this.cargaComparativo = true;
    this.ingresoLoteSeleccionado = ingresoLote;
    this.listaLoteDetallePorIngresoLote = await this.http
      .get<Array<LoteDetalleView>>(
        environment.apiUrl +
          "/proyIngresoLote/comparativo/" +
          ingresoLote.idProyIngresoLote
      )
      .toPromise();
    this.cargaComparativo = false;
    this.modalService.open(this.modalListaLoteDetalleReales, { size: "xl" });
  }
  async proyectar(ingresoLote: IngresoLote) {
    this.ingresoLoteSeleccionado = ingresoLote;
    this.mostrarCargaProyeccion = true;
    await this.http
      .post(environment.apiUrl + "/proyLoteDetalle/proyectar", ingresoLote)
      .toPromise();
    this.mostrarCargaProyeccion = false;
    this.listarLotes();
  }
  async exportarExcelLoteDetalle() {
    this.cargaExportacionExcelDetalle = true;
    const row = await this.http
      .get<any>(
        environment.apiUrl +
          "/proyLoteDetalle/listar/" +
          this.ingresoLoteSeleccionado.idProyIngresoLote +
          "/exportarExcel"
      )
      .toPromise();
    this.cargaExportacionExcelDetalle = false;
    window.open(row.rutaCompletaCM);
  }
  async exportarExcelLoteDetalleReales() {
    this.cargaExportacionExcelDetalle = true;
    const row = await this.http
      .get<any>(
        environment.apiUrl +
          "/proyLoteDetalle/listar/" +
          this.ingresoLoteSeleccionado.idProyIngresoLote +
          "/exportarExcelReal"
      )
      .toPromise();
    this.cargaExportacionExcelDetalle = false;
    window.open(row.rutaCompletaCM);
  }
}
