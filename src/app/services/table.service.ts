import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Table } from "../models/Table";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class TableService {
  constructor(private http: HttpClient) {}
  list(): Observable<Table[]> {
    return this.http.get<Table[]>(environment.apiUrl + "/tables");
  }

  save(table: Table) {
    return this.http.post<void>(environment.apiUrl + "/tables", table);
  }
  update(table: Table) {
    return this.http.post<void>(
      environment.apiUrl + "/tables/" + table.id + "/update",
      table
    );
  }
  remove(tableId: string) {
    return this.http.delete<void>(environment.apiUrl + "/tables/" + tableId);
  }
}
