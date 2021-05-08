import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FactorMortalidad } from "../models/factorMortalidad";

@Injectable({
  providedIn: "root",
})
export class FactorService {
  constructor(private http: HttpClient) {}
  listarFactores(): Observable<Array<FactorMortalidad>> {
    return this.http.get<Array<FactorMortalidad>>(
      environment.apiUrl + "/factor/"
    );
  }
}
