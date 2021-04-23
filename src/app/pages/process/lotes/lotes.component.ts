import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
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
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private loadingService: LoaderService
  ) {
    this.isLoadingForms = loadingService.isLoading;
    this.listaDeLotes = [];
  }

  ngOnInit(): void {
    this.crearFormularioIngresoLotes();
    this.listarLotes();
  }
  crearFormularioIngresoLotes() {
    this.formularioIngresoLotes = this.fb.group({
      idProyIngresoLote: [0],
      poblacionLh: ["", [Validators.required, Validators.min(1)]],
      poblacionLm: ["", [Validators.required, Validators.min(1)]],
      semanasLevante: ["", [Validators.required, Validators.min(1)]],
      semanasProduccion: ["", [Validators.required, Validators.min(1)]],
    });
  }
  nuevoIngresoLotes() {
    this.formularioIngresoLotes.reset();
    this.modalService
      .open(this.modalFormularioIngresoLotes)
      .dismissed.subscribe(() => {
        this.listarLotes();
      });
  }
  editarLote(lote: IngresoLote) {
    this.formularioIngresoLotes.patchValue(lote);
    this.modalService
      .open(this.modalFormularioIngresoLotes)
      .dismissed.subscribe(() => {
        this.listarLotes();
      });
  }
  async listarLotes() {
    this.listaDeLotes = await this.http
      .get<Array<IngresoLote>>(environment.apiUrl + "/proyIngresoLote")
      .toPromise();
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
    console.log("lote", lote);
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
