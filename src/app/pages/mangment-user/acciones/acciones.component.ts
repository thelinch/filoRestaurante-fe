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
import { Subscription } from "rxjs";
import { TableCustomGenericComponent } from "src/app/common/table-custom-generic/table-custom-generic.component";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { environment } from "src/environments/environment";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-acciones",
  templateUrl: "./acciones.component.html",
  styleUrls: ["./acciones.component.scss"],
})
export class AccionesComponent implements OnInit, OnDestroy {
  isLoadingAcciones = true;

  formularioAcciones: FormGroup;
  headers = [
    {
      headerName: "Accion",
      bindValue: "name",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Acciones",
      bindValue: "Acciones",
      isActions: true,
      isTemplate: false,
    },
  ];
  listAccionesData = [];
  listMenusData = [];
  subscriptionEditAccionEvent: Subscription;
  subscriptionEditMenuEvent: Subscription;
  isLoadingForms;
  @ViewChild("editAndCreateAccion") modalFormAccion: TemplateRef<any>;

  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private loadingService: LoaderService
  ) {
    this.isLoadingForms = loadingService.isLoading;
  }
  ngOnDestroy(): void {
    this.subscriptionEditAccionEvent?.unsubscribe();
    this.subscriptionEditMenuEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.crearFormularioAcciones();
    this.listAcciones();
    this.subscriptionEditAccionEvent = this.eventService.subscribe(
      "editAccion",
      (accion) => {
        this.editarAccion(accion);
      }
    );
  }
  editarAccion(accion: any) {
    this.formularioAcciones.patchValue(accion);
    this.modalService.open(this.modalFormAccion).hidden.subscribe(() => {
      this.formularioAcciones.reset({ idAcciones: 0 });
      this.listAcciones();
    });
  }
  nuevaAccion() {
    this.modalService.open(this.modalFormAccion).hidden.subscribe(() => {
      this.listAcciones();
      this.formularioAcciones.reset({ idAcciones: 0 });
    });
  }

  async crearYActualizarAccion(accion: any) {
    this.formularioAcciones.markAllAsTouched();
    const uuid = uuidv4();
    if (this.formularioAcciones.invalid) {
      return;
    }
    let url = "/action/";
    if (!accion.id) {
      await this.http
        .post(environment.apiUrl + url, { ...accion, id: uuid })
        .toPromise();
    } else {
      await this.http
        .post(environment.apiUrl + url + `${accion.id}/update`, accion)
        .toPromise();
    }
    this.modalService.dismissAll();
  }

  get accionFormularioControles() {
    return this.formularioAcciones.controls;
  }

  crearFormularioAcciones() {
    this.formularioAcciones = this.fb.group({
      id: [null],
      name: ["", [Validators.required]],
    });
  }
  compareMenus(a: any, b: any) {
    return a?.idMenu === b?.idMenu;
  }
  async listAcciones() {
    this.isLoadingAcciones = true;
    const acciones = await this.http
      .get<Array<any>>(environment.apiUrl + "/action")
      .toPromise();
    this.listAccionesData = [
      ...acciones.map((accion, index) => ({
        ...accion,
        acciones: [
          `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editAccion" class="btn btn-success buttonEvent mr2">Editar</button>
    </div>`,
        ],
      })),
    ];
    this.isLoadingAcciones = false;
  }
}
