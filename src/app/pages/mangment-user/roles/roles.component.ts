import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { Subscription } from "rxjs";
import { TableCustomGenericComponent } from "src/app/common/table-custom-generic/table-custom-generic.component";
import { EventService } from "src/app/core/services/event.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit, OnDestroy {
  isLoadingRoles = true;
  roles: Array<any> = [];
  headers = [
    { headerName: "Rol", bindValue: "Rol", isActions: false },
    { headerName: "Acciones", bindValue: "Acciones", isActions: true },
  ];
  @ViewChild(TableCustomGenericComponent)
  tableGenerico: TableCustomGenericComponent;
  editRolEvent: Subscription;
  deleteRolEvent: Subscription;
  constructor(private http: HttpClient, private eventService: EventService) {}
  ngOnDestroy(): void {
    this.editRolEvent?.unsubscribe();
    this.deleteRolEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.editRolEvent = this.eventService.subscribe("editRol", (rol) => {
      this.editRol(rol);
    });
    this.deleteRolEvent = this.eventService.subscribe("deleteRol", (rol) => {
      this.deleteRol(rol);
    });
    this.listRoles();
  }
  async listRoles() {
    this.isLoadingRoles = true;
    const roles = await this.http
      .get<Array<any>>(environment.apiUrl + "/proyRol/todos")
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
  editRol(rol: any) {
    console.log("rol", rol);
  }
  deleteRol(rol: any) {
    console.log("delete rol", rol);
  }
}
