import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { IngresoLote } from "../models/IngresoLote";

@Injectable({
  providedIn: "root",
})
export class IngresoLoteService {
  constructor(private http: HttpClient) {}
  listar() {
    return this.http.get<Array<IngresoLote>>(
      environment.apiUrl + "/proyIngresoLote"
    );
  }
}
