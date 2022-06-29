import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Category } from "../models/CategoryBodyRequestDto";
import { TypeOrder } from "../models/TypeOrder";

@Injectable({
  providedIn: "root",
})
export class TypeOrderService {
  constructor(private http: HttpClient) {}
  list(): Observable<TypeOrder[]> {
    return this.http.get<TypeOrder[]>(environment.apiUrl + "/typeOrders");
  }
  create(typeOrder: TypeOrder) {
    return this.http.post(environment.apiUrl + "/typeOrders", typeOrder);
  }
  update(typeOrder: TypeOrder) {
    return this.http.post(
      environment.apiUrl + "/typeOrders/" + typeOrder.id + "/update",
      typeOrder
    );
  }

}
