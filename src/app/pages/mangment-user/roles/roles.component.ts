import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { TableCustomGenericComponent } from "src/app/common/table-custom-generic/table-custom-generic.component";
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
    { headerName: "Acciones", bindValue: "Acciones", isActions: false },
  ];
  @ViewChild(TableCustomGenericComponent)
  tableGenerico: TableCustomGenericComponent;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listRoles();
  }
  async listRoles() {
    this.isLoadingRoles = true;
    const roles = await this.http
      .get<Array<any>>(environment.apiUrl + "/rol")
      .toPromise();
    this.tableGenerico.setDataTable(roles);
    this.isLoadingRoles = false;
  }
}
