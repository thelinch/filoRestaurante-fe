import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { Observable } from "rxjs";
import { LoaderService } from "src/app/core/services/loader.service";
import { IngresoLote } from "src/app/models/IngresoLote";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-lotes",
  templateUrl: "./lotes.component.html",
  styleUrls: ["./lotes.component.scss"],
})
export class LotesComponent implements OnInit {
  formularioIngresoLotes: FormGroup;
  isLoadingForms: Observable<boolean>;
  @ViewChild("editAndCreateIngresoLote")
  modalFormularioIngresoLotes: TemplateRef<any>;
  listaDeLotes: Array<IngresoLote>;
  ultimoIngresoLote: Partial<IngresoLote>;
  cargaListaLotes: boolean;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private loadingService: LoaderService
  ) {
    this.isLoadingForms = loadingService.isLoading;
    this.listaDeLotes = [];
    this.ultimoIngresoLote = { nombreIngreso: "" };
    this.cargaListaLotes = true;
  }

  ngOnInit(): void {
    this.crearFormularioIngresoLotes();
    this.listarLotes();
  }
  crearFormularioIngresoLotes() {
    this.formularioIngresoLotes = this.fb.group({
      idProyIngresoLote: [0],
      fechaIngreso: ["", [Validators.required]],
      poblacionLh: ["", [Validators.required, Validators.min(1)]],
      poblacionLm: ["", [Validators.required, Validators.min(1)]],
      semanasLevante: ["", [Validators.required, Validators.min(1)]],
      semanasProduccion: ["", [Validators.required, Validators.min(1)]],
    });
  }
  async traerUltimoIngresoLote() {
    const { numeroIngreso, fechaIngreso, loteInicial }: IngresoLote =
      await this.http
        .get<IngresoLote>(
          environment.apiUrl + "/proyIngresoLote/ultimoIngresoLote"
        )
        .toPromise();
    const ingresoLoteInicialCalculado =
      loteInicial == 0 ? loteInicial + 1 : loteInicial + 2;
    this.ultimoIngresoLote = {
      numeroIngreso: numeroIngreso + 1,
      loteInicial: ingresoLoteInicialCalculado,
      fechaIngreso: moment(fechaIngreso).add(91, "days").format("YYYY-MM-DD"),
      nombreIngreso: `${
        numeroIngreso + 1
      } ingreso LH-${ingresoLoteInicialCalculado}`,
    };
  }
  async nuevoIngresoLotes() {
    await this.traerUltimoIngresoLote();
    this.formularioIngresoLotes.reset({
      fechaIngreso:
        this.ultimoIngresoLote?.fechaIngreso || moment().format("YYYY-MM-DD"),
    });
    this.modalService
      .open(this.modalFormularioIngresoLotes)
      .dismissed.subscribe(() => {
        this.listarLotes();
      });
  }
  editarLote(lote: IngresoLote) {
    this.ultimoIngresoLote.nombreIngreso = lote.nombreIngreso;
    this.formularioIngresoLotes.patchValue(lote);
    this.modalService
      .open(this.modalFormularioIngresoLotes)
      .dismissed.subscribe(() => {
        this.listarLotes();
      });
  }
  async listarLotes() {
    this.cargaListaLotes = true;
    this.listaDeLotes = await this.http
      .get<Array<IngresoLote>>(environment.apiUrl + "/proyIngresoLote")
      .toPromise();
    this.cargaListaLotes = false;
  }
  async cerrarProyIngresoLote(proyIngresoLoteId: number) {
    await this.http
      .get(
        environment.apiUrl +
          "/proyIngresoLote/actualizar/" +
          proyIngresoLoteId +
          "/estado/1"
      )
      .toPromise();
    this.listarLotes();
  }
  async crearyEditaIngresoLotes(lote: IngresoLote) {
    this.formularioIngresoLotes.markAllAsTouched();
    if (this.formularioIngresoLotes.invalid) {
      return;
    }
    let url = environment.apiUrl + "/proyIngresoLote/";
    if (lote.idProyIngresoLote > 0) {
      url = url.concat("editar");
    }
    const data = await this.http.post(url, lote).toPromise();
    this.modalService.dismissAll();
  }
  get formularioIngresoLotesControles() {
    return this.formularioIngresoLotes.controls;
  }
}
