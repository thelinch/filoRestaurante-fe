import { HttpClient } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { IngresoLote } from "src/app/models/IngresoLote";
import { ProyStandardMacho } from "src/app/models/proyStandardMale";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-projection-standard-male",
  templateUrl: "./projection-standard-male.component.html",
  styleUrls: ["./projection-standard-male.component.scss"],
})
export class ProjectionStandardMaleComponent implements OnInit {
  formularioProyeccionMacho: FormGroup;
  headersStandardMacho = [
    { headerName: "semana", bindValue: "semana", isActions: false },
    {
      headerName: "Porcentaje Postura",
      bindValue: "porc_postura",
      isActions: false,
    },
    {
      headerName: "Porcentaje Huevos Incubable",
      bindValue: "porc_hi",
      isActions: false,
    },
    {
      headerName: "Porcentaje Nacimiento",
      bindValue: "porc_nacimiento",
      isActions: false,
    },
    { headerName: "Acciones", bindValue: "Acciones", isActions: true },
  ];
  listaStandardHembra: ProyStandardMacho[] = [];
  @ViewChild("editAndCreateProyStandardMacho")
  modalFormProyStandandMacho: TemplateRef<any>;
  subscriptionEditProjectionMachoEvent: Subscription;
  listaIngresoLote: Array<IngresoLote>;
  isLoadingIngresoLote: boolean;
  subscriptionRemoveProjectionMachoEvent: Subscription;
  isLoadingForms: Observable<boolean>;
  formularioIngresoLote: FormGroup;
  isLoadingProyeccion: boolean;
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private http: HttpClient,
    private modalService: NgbModal,
    private loadingService: LoaderService
  ) {
    this.isLoadingForms = this.loadingService.isLoading;
    this.listaIngresoLote = [];
    this.isLoadingIngresoLote = true;
    this.isLoadingProyeccion = false;
  }
  ngOnDestroy(): void {
    this.subscriptionEditProjectionMachoEvent?.unsubscribe();
    this.subscriptionRemoveProjectionMachoEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.crearFormularioProyeccionStandardMacho();
    this.crearFormularioIngresoLote();

    this.listarStandardMacho();
    this.listarProyIngreso();
    this.subscriptionEditProjectionMachoEvent = this.eventService.subscribe(
      "editProyeccionMacho",
      (proyecionHembraEdit: ProyStandardMacho) => {
        this.editarStandardHembra(proyecionHembraEdit);
      }
    );
    this.subscriptionRemoveProjectionMachoEvent = this.eventService.subscribe(
      "removeProyeccionMacho",
      (proyecionHembraEdit: ProyStandardMacho) => {
        this.removeStandardHembra(proyecionHembraEdit);
      }
    );
  }
  async actualizarProyeccionPorIngresoDeLotes(
    ingresoLotes: Array<IngresoLote>
  ) {
    this.isLoadingProyeccion = true;
    await this.http
      .post(
        environment.apiUrl + "/proyLoteDetalle/proyectar/lista",
        ingresoLotes
      )
      .toPromise();
    this.isLoadingProyeccion = false;
    console.log("a", ingresoLotes);
  }
  crearNuevoStandardMacho() {
    this.formularioProyeccionMacho.reset();
    this.modalService
      .open(this.modalFormProyStandandMacho)
      .dismissed.subscribe(() => {
        this.listarStandardMacho();
      });
  }
  async listarProyIngreso() {
    this.isLoadingIngresoLote = true;
    this.listaIngresoLote = await this.http
      .get<Array<IngresoLote>>(
        environment.apiUrl + "/proyIngresoLote/listarAprobadosyProyectados"
      )
      .toPromise();
    this.isLoadingIngresoLote = false;
  }
  async crearYActualizarProyStandardHembra(
    proyeccionStandardHembra: ProyStandardMacho
  ) {
    console.log("ss", proyeccionStandardHembra);
    this.formularioProyeccionMacho.markAllAsTouched();
    if (this.formularioProyeccionMacho.invalid) {
      return;
    }
    let url = environment.apiUrl + "/standardMacho";
    if (proyeccionStandardHembra.idStandardProyMacho > 0) {
      url = url.concat("/editar");
    }
    await this.http.post(url, proyeccionStandardHembra).toPromise();
    this.modalService.dismissAll();
  }
  editarStandardHembra(proyStandardHembra: ProyStandardMacho) {
    this.formularioProyeccionMacho.patchValue(proyStandardHembra);
    this.modalService
      .open(this.modalFormProyStandandMacho)
      .dismissed.subscribe(() => {
        this.listarStandardMacho();
      });
  }
  async removeStandardHembra(proyStandardHembra: ProyStandardMacho) {
    console.log(proyStandardHembra);
    await this.http
      .get(
        environment.apiUrl +
          "/standardMacho/eliminar/" +
          proyStandardHembra.idStandardProyMacho
      )
      .toPromise();
    this.listarStandardMacho();
  }
  async listarStandardMacho() {
    this.listaStandardHembra = (
      await this.http
        .get<Array<ProyStandardMacho>>(environment.apiUrl + "/standardMacho")
        .toPromise()
    ).map((proy, index) => ({
      ...proy,
      acciones: [
        `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editProyeccionMacho" class="btn btn-success buttonEvent mr2">Editar</button>
    <button type="button" data-index=${index}  data-function="removeProyeccionMacho" class="btn buttonEvent btn- btn-danger">Eliminar</button>
    </div>`,
      ],
    }));
  }
  crearFormularioProyeccionStandardMacho() {
    this.formularioProyeccionMacho = this.fb.group({
      idStandardProyMacho: [0],
      semana: [25, [Validators.required, Validators.min(25)]],
      porc_postura: ["", [Validators.required]],
      porc_hi: ["", [Validators.required]],
      porc_nacimiento: ["", [Validators.required]],
    });
  }
  crearFormularioIngresoLote() {
    this.formularioIngresoLote = this.fb.group({
      ingresoLotes: [null, [Validators.required]],
    });
  }
  get formularioProyeccionMachoControles() {
    return this.formularioProyeccionMacho.controls;
  }
}
