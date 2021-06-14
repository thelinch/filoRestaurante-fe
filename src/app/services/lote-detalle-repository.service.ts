import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";
import { LoteDetalleView } from "../models/loteDetalle";

@Injectable({
  providedIn: "root",
})
export class LoteDetalleRepositoryService {
  constructor(private http: HttpClient) {}

  listarDetallePorIngresoLote(
    ingresoLoteId: number
  ): Observable<Array<LoteDetalleView>> {
    return this.http.get<Array<LoteDetalleView>>(
      environment.apiUrl + "/proyLoteDetalle/listar/" + ingresoLoteId
    );
  }
}
