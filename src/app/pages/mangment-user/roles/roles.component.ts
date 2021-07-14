import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewChildren,
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
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit, OnDestroy {
  isLoadingRoles = true;
  roles: Array<any> = [];
  isLoadingForms;
  headers = [
    {
      headerName: "Rol",
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
  @ViewChild(TableCustomGenericComponent)
  tableGenerico: TableCustomGenericComponent;
  @ViewChild("editAndCreateRol") modalFormRol: TemplateRef<any>;

  editRolEvent: Subscription;
  deleteRolEvent: Subscription;
  formularioRole: FormGroup;
  listAccionesData: Array<any>;
  submitFormRol = false;
  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) {
    this.listAccionesData = [];
    this.isLoadingForms = this.loaderService.isLoading;
  }
  ngOnDestroy(): void {
    this.editRolEvent?.unsubscribe();
    this.deleteRolEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.crearFormularioRol();
    this.editRolEvent = this.eventService.subscribe("editRol", (rol) => {
      this.editRol(rol);
    });
    this.deleteRolEvent = this.eventService.subscribe("deleteRol", (rol) => {
      this.deleteRol(rol);
    });
    this.listRoles();
    this.listAcciones();
  }
  crearFormularioRol() {
    this.formularioRole = this.fb.group({
      id: [0],
      name: ["", [Validators.required]],
      actions: [[], [Validators.required]],
    });
  }
  crearNuevoRol() {
    this.formularioRole.reset();
    this.modalService.open(this.modalFormRol).hidden.subscribe(() => {
      this.listRoles();
    });
  }
  async listRoles() {
    this.isLoadingRoles = true;
    const roles = await this.http
      .get<Array<any>>(environment.apiUrl + "/role")
      .toPromise();
    this.tableGenerico.setDataTable(
      roles.map((rol, index) => ({
        ...rol,
        acciones: [
          `<div class="button-items">
          <button type="button" data-index=${index}   data-function="editRol" class="btn btn-success buttonEvent mr2">Editar</button>
          <button type="button" data-index=${index}  data-function="deleteRol" class="btn buttonEvent btn- btn-danger">Eliminar</button>
          </div>`,
        ],
      }))
    );
    this.isLoadingRoles = false;
  }
  async listAcciones() {
    const acciones = await this.http
      .get<Array<any>>(environment.apiUrl + "/action/")
      .toPromise();
    this.listAccionesData = acciones;
  }
  get controlsFormularioRoles() {
    return this.formularioRole.controls;
  }
  async crearYActualizarRole(rol: any) {
    this.submitFormRol = true;
    if (this.formularioRole.invalid) {
      return;
    }
    const uuid = uuidv4();

    if (!rol.id) {
      await this.http
        .post(environment.apiUrl + "/role", { ...rol, id: uuid })
        .toPromise();
    } else {
      await this.http
        .post(environment.apiUrl + "/role/" + rol.id + "/update", { ...rol })
        .toPromise();
    }
    this.modalService.dismissAll();
  }

  async editRol(rol: any) {
    this.formularioRole.patchValue(rol);
    this.modalService.open(this.modalFormRol).hidden.subscribe(() => {
      this.listRoles();
    });
  }
  deleteRol(rol: any) {
    console.log("delete rol", rol);
  }
  compareWithAccion(a: any, b: any) {
    return a?.id === b?.id;
  }
}
