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

@Component({
  selector: "app-acciones",
  templateUrl: "./acciones.component.html",
  styleUrls: ["./acciones.component.scss"],
})
export class AccionesComponent implements OnInit, OnDestroy {
  isLoadingAcciones = true;

  formularioMenu: FormGroup;
  formularioAcciones: FormGroup;
  headers = [
    { headerName: "Menu", bindValue: "menu.Menu", isActions: false },
    { headerName: "Accion", bindValue: "Accion", isActions: false },
    { headerName: "Codigo", bindValue: "codigo", isActions: false },
    { headerName: "Acciones", bindValue: "Acciones", isActions: true },

  ];
  headerMenu = [
    { headerName: "Menu", bindValue: "Menu", isActions: false },
    { headerName: "Acciones", bindValue: "", isActions: true },
  ];
  listAccionesData = [];
  listMenusData = [];
  subscriptionEditAccionEvent: Subscription;
  subscriptionEditMenuEvent: Subscription;
  isLoadingForms;
  @ViewChild("editAndCreateMenu") modalFormMenu: TemplateRef<any>;
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
    this.crearFormularioMenu();
    this.crearFormularioAcciones();
    this.listarMenus();
    this.listAcciones();
    this.subscriptionEditAccionEvent = this.eventService.subscribe(
      "editAccion",
      (accion) => {
        this.editarAccion(accion);
      }
    );

    this.subscriptionEditMenuEvent = this.eventService.subscribe(
      "editMenu",
      (menu) => {
        this.editarMenu(menu);
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
  editarMenu(menu: any) {
    this.formularioMenu.patchValue(menu);
    this.modalService.open(this.modalFormMenu).hidden.subscribe(() => {
      this.formularioMenu.reset({ idMenu: 0 });
      this.listarMenus();
    });
  }
  nuevoMenu() {
    this.modalService.open(this.modalFormMenu).hidden.subscribe(() => {
      this.formularioMenu.reset({ idMenu: 0 });
      this.listarMenus();
    });
  }
  async crearYActualizarMenu(menu: any) {
    this.formularioMenu.markAllAsTouched();
    if (this.formularioMenu.invalid) {
      return;
    }
    let url = "/proyMenu/";
    if (menu.idMenu != 0) {
      url = url.concat("editar");
    }
    await this.http.post(environment.apiUrl + url, menu).toPromise();
    this.modalService.dismissAll();
  }
  async crearYActualizarAccion(accion: any) {
    console.log("a", accion);
    this.formularioAcciones.markAllAsTouched();
    if (this.formularioAcciones.invalid) {
      return;
    }
    let url = "/proyAccion/";
    if (accion.idAcciones != 0) {
      url = url.concat("editar");
    }
    await this.http.post(environment.apiUrl + url, accion).toPromise();
    this.modalService.dismissAll();
  }
  get menuFormularioControles() {
    return this.formularioMenu.controls;
  }
  get accionFormularioControles() {
    return this.formularioAcciones.controls;
  }
  crearFormularioMenu() {
    this.formularioMenu = this.fb.group({
      idMenu: [0],
      Menu: ["", [Validators.required]],
    });
  }
  crearFormularioAcciones() {
    this.formularioAcciones = this.fb.group({
      idAcciones: [0],
      Accion: ["", [Validators.required]],
      codigo: ["", [Validators.required]],
      menu: ["", [Validators.required]],
    });
  }
  compareMenus(a: any, b: any) {
    return a?.idMenu === b?.idMenu;
  }
  async listAcciones() {
    this.isLoadingAcciones = true;
    const acciones = await this.http
      .get<Array<any>>(environment.apiUrl + "/proyAccion")
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
  async listarMenus() {
    const menus = await this.http
      .get<Array<any>>(environment.apiUrl + "/proyMenu")
      .toPromise();
    this.listMenusData = [
      ...menus.map((accion, index) => ({
        ...accion,
        acciones: [
          `<div class="button-items">
          <button type="button" data-index=${index}   data-function="editMenu" class="btn btn-success buttonEvent mr2">Editar</button>
          </div>`,
        ],
      })),
    ];
  }
}
