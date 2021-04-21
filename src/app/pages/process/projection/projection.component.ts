import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { LoaderService } from "src/app/core/services/loader.service";
import { IngresoLote } from "src/app/models/IngresoLote";
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
  ingresoLoteSeleccionado: IngresoLote;
  listaDeLotes: Array<IngresoLote>;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loadingService: LoaderService,
    private modalService: NgbModal
  ) {
    this.isLoading = loadingService.isLoading;
  }

  ngOnInit(): void {
    this.crearFormularioFactorProduccion();
    this.listarLotes();
  }
  openModalFormularioEdicionFactorProduccion() {
    this.modalService.open(this.modalFormularioFactorProduccion);
  }
  crearFormularioFactorProduccion() {
    this.formularioEdicionFactorProduccion = this.fb.group({
      id: [0],
      porcentajePostura: [null, [Validators.required]],
      porcentajeHi: [null, [Validators.required]],
      porcentajeNacimiento: [null, [Validators.required]],
      semana: [null, [Validators.required]],
    });
  }
  async listarLotes() {
    this.listaDeLotes = await this.http
      .get<Array<IngresoLote>>(environment.apiUrl + "/proyIngresoLote")
      .toPromise();
  }
  get formularioEdicionFactorProduccionControles() {
    return this.formularioEdicionFactorProduccion.controls;
  }
  async proyectar(ingresoLote: IngresoLote) {
    this.ingresoLoteSeleccionado = ingresoLote;
    await this.http
      .post(environment.apiUrl + "/proyLoteDetalle/proyectar", ingresoLote)
      .toPromise();
  }
}
