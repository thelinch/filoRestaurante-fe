import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { environment } from "src/environments/environment";
import { ProyStandardHembra } from "../../../models/proyStandardFemale";
@Component({
  selector: "app-projection-standard-female",
  templateUrl: "./projection-standard-female.component.html",
  styleUrls: ["./projection-standard-female.component.scss"],
})
export class ProjectionStandardFemaleComponent implements OnInit, OnDestroy {
  formularioProyeccionHembra: FormGroup;
  headersStandardHembra = [
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
  listaStandardHembra: ProyStandardHembra[] = [];
  @ViewChild("editAndCreateProyStandardHembra")
  modalFormProyStandandHembra: TemplateRef<any>;
  subscriptionEditProjectionHembraEvent: Subscription;
  subscriptionRemoveProjectionHembraEvent: Subscription;
  isLoadingForms: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private http: HttpClient,
    private modalService: NgbModal,
    private loadingService: LoaderService
  ) {
    this.isLoadingForms = this.loadingService.isLoading;
  }
  ngOnDestroy(): void {
    this.subscriptionEditProjectionHembraEvent?.unsubscribe();
    this.subscriptionRemoveProjectionHembraEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.crearFormularioProyeccionStandardHembra();
    this.listarStandardHembra();
    this.subscriptionEditProjectionHembraEvent = this.eventService.subscribe(
      "editProyeccionHembra",
      (proyecionHembraEdit: ProyStandardHembra) => {
        this.editarStandardHembra(proyecionHembraEdit);
      }
    );
    this.subscriptionRemoveProjectionHembraEvent = this.eventService.subscribe(
      "removeProyeccionHembra",
      (proyecionHembraEdit: ProyStandardHembra) => {
        this.removeStandardHembra(proyecionHembraEdit);
      }
    );
  }
  crearNuevoStandardHembra() {
    this.formularioProyeccionHembra.reset();
    this.modalService
      .open(this.modalFormProyStandandHembra)
      .dismissed.subscribe(() => {
        this.listarStandardHembra();
      });
  }
  async crearYActualizarProyStandardHembra(
    proyeccionStandardHembra: ProyStandardHembra
  ) {
    this.formularioProyeccionHembra.markAllAsTouched();
    if (this.formularioProyeccionHembra.invalid) {
      return;
    }
    let url = environment.apiUrl + "/standardHembra";
    if (proyeccionStandardHembra.idStandardProyHembra > 0) {
      url = url.concat("/editar");
    }
    await this.http.post(url, proyeccionStandardHembra).toPromise();
    this.modalService.dismissAll();
  }
  editarStandardHembra(proyStandardHembra: ProyStandardHembra) {
    this.formularioProyeccionHembra.patchValue(proyStandardHembra);
    this.modalService
      .open(this.modalFormProyStandandHembra)
      .dismissed.subscribe(() => {
        this.listarStandardHembra();
      });
  }
  async removeStandardHembra(proyStandardHembra: ProyStandardHembra) {
    console.log(proyStandardHembra)
    await this.http
      .get(
        environment.apiUrl +
          "/standardHembra/eliminar/" +
          proyStandardHembra.idStandardProyHembra
      )
      .toPromise();
    this.listarStandardHembra();
  }
  async listarStandardHembra() {
    this.listaStandardHembra = (
      await this.http
        .get<Array<ProyStandardHembra>>(environment.apiUrl + "/standardHembra")
        .toPromise()
    ).map((proy, index) => ({
      ...proy,
      acciones: [
        `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editProyeccionHembra" class="btn btn-success buttonEvent mr2">Editar</button>
    <button type="button" data-index=${index}  data-function="removeProyeccionHembra" class="btn buttonEvent btn- btn-danger">Eliminar</button>
    </div>`,
      ],
    }));
  }
  crearFormularioProyeccionStandardHembra() {
    this.formularioProyeccionHembra = this.fb.group({
      idStandardProyHembra: [0],
      semana: [25, [Validators.required, Validators.min(25)]],
      porc_postura: ["", [Validators.required]],
      porc_hi: ["", [Validators.required]],
      porc_nacimiento: ["", [Validators.required]],
    });
  }
  get formularioProyeccionHembraControles() {
    return this.formularioProyeccionHembra.controls;
  }
}
