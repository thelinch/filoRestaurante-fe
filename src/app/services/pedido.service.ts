import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { PedidoVenta } from "../models/pedidoVenta";
import { pedidoVentaDetalle } from "../models/pedidoVentaDetalle";

@Injectable({
  providedIn: "root",
})
export class PedidoService {
  constructor(private http: HttpClient) {}
  validarFechaRegisto(fechaRegistro: string): Observable<boolean> {
    return this.http.get<boolean>("");
  }
  fechaValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.validarFechaRegisto(control.value).pipe(
        map((res) => {
          return res ? {} : null;
        })
      );
    };
  }
  crear(pedidoVentaDetalle: PedidoVenta) {
    return this.http.post(
      environment.apiUrl + "/pedidoVenta",
      pedidoVentaDetalle
    );
  }
  editar(pedidoVenta: PedidoVenta) {
    return this.http.post(
      environment.apiUrl + "/pedidoVenta/editar",
      pedidoVenta
    );
  }
  listar(): Observable<Array<PedidoVenta>> {
    return this.http.get<Array<PedidoVenta>>(
      environment.apiUrl + "/pedidoVenta/listar"
    );
  }
  exportarExcel({ fechaInicio, fechaFin, rucClientes = [] }) {
    return this.http.post<any>(
      environment.apiUrl + "/pedidoVenta/exportarExcelPedidoVenta",
      { fechaFin, fechaInicio, rucClientes }
    );
  }
  listarClientes() {
    return this.http.post<Array<any>>(
      environment.apiUrl + "/DBCostsSG/clientes/SG",
      null
    );
  }
  listarPedidoDetallePorIdPedidoVenta(
    pedidoVentaId: number
  ): Observable<Array<pedidoVentaDetalle>> {
    return this.http.get<Array<pedidoVentaDetalle>>(
      environment.apiUrl + "/pedidoVentaDetalle/listarPorVenta/" + pedidoVentaId
    );
  }
}
