import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { TableCustomGenericComponent } from "src/app/common/table-custom-generic/table-custom-generic.component";
import { EventService } from "src/app/core/services/event.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  isLoadingRoles = true;
  roles: Array<any> = [];
  headers = [
    { headerName: "Rol", bindValue: "Rol", isActions: false },
    { headerName: "Acciones", bindValue: "Acciones", isActions: true },
  ];
  @ViewChild(TableCustomGenericComponent)
  tableGenerico: TableCustomGenericComponent;
  constructor(private http: HttpClient, private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.subscribe("editRol", (rol) => {
      this.editRol(rol);
    });
    this.eventService.subscribe("deleteRol", (rol) => {
      this.deleteRol(rol);
    });
    this.listRoles();
  }
  async listRoles() {
    const $this = this;
    this.isLoadingRoles = true;
    console.log(this.editRol);
    const roles = await this.http
      .get<Array<any>>(environment.apiUrl + "/rol")
      .toPromise();
    this.tableGenerico.setDataTable(
      roles.map((rol, index) => ({
        ...rol,
        acciones: [
          `<button type="button" data-index=${index}   data-function="editRol" class="btn btn-primary buttonEvent mr2">Editar</button>`,
          `<button type="button" data-index=${index}  data-function="deleteRol" class="btn buttonEvent btn-primary">Eliminar</button>`,
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
