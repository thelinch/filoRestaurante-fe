import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { TableCustomGenericComponent } from "src/app/common/table-custom-generic/table-custom-generic.component";
import { EventService } from "src/app/core/services/event.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-acciones",
  templateUrl: "./acciones.component.html",
  styleUrls: ["./acciones.component.scss"],
})
export class AccionesComponent implements OnInit, OnDestroy {
  isLoadingAcciones = true;
  /*   @ViewChild("tableAccion")
  tableGenericoAccion: TableCustomGenericComponent;
  @ViewChild("tableMenu")
  tableGenericoMenu: TableCustomGenericComponent; */
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
  subscriptionRemoveAccionEvent: Subscription;
  subscriptionRemoveMenuEvent: Subscription;
  subscriptionEditMenuEvent: Subscription;
  constructor(private http: HttpClient, private eventService: EventService) {}
  ngOnDestroy(): void {
    this.subscriptionEditAccionEvent?.unsubscribe();
    this.subscriptionRemoveAccionEvent?.unsubscribe();
    this.subscriptionRemoveMenuEvent?.unsubscribe();
    this.subscriptionEditMenuEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.listarMenus();
    this.listAcciones();
    this.subscriptionEditAccionEvent = this.eventService.subscribe(
      "editAccion",
      (accion) => {
        console.log("acccon", accion);
      }
    );
    this.subscriptionRemoveAccionEvent = this.eventService.subscribe(
      "deleteAccion",
      (accion) => {
        console.log("delete", accion);
      }
    );
    this.subscriptionEditMenuEvent = this.eventService.subscribe(
      "editMenu",
      (menu) => {
        console.log("edit menu", menu);
      }
    );
    this.subscriptionRemoveMenuEvent = this.eventService.subscribe(
      "deleteMenu",
      (menu) => {
        console.log("delete EMnu", menu);
      }
    );
  }

  async listAcciones() {
    this.isLoadingAcciones = true;
    const acciones = await this.http
      .get<Array<any>>(environment.apiUrl + "/proyAccion")
      .toPromise();
    this.listAccionesData = acciones.map((accion, index) => ({
      ...accion,
      acciones: [
        `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editAccion" class="btn btn-success buttonEvent mr2">Editar</button>
    <button type="button" data-index=${index}  data-function="deleteAccion" class="btn buttonEvent btn- btn-danger">Eliminar</button>
    </div>`,
      ],
    }));
    this.isLoadingAcciones = false;
  }
  async listarMenus() {
    const menus = await this.http
      .get<Array<any>>(environment.apiUrl + "/proyMenu")
      .toPromise();
    this.listMenusData = menus.map((accion, index) => ({
      ...accion,
      acciones: [
        `<div class="button-items">
          <button type="button" data-index=${index}   data-function="editMenu" class="btn btn-success buttonEvent mr2">Editar</button>
          <button type="button" data-index=${index}  data-function="deleteMenu" class="btn buttonEvent btn- btn-danger">Eliminar</button>
          </div>`,
      ],
    }));
  }
}
