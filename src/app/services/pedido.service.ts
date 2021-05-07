import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

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
}
