import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Category } from "../models/CategoryBodyRequestDto";
import { Order } from "../models/Order";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(private http: HttpClient) {}
  listForCategories(categories: Category[]): Observable<Order[]> {
    return this.http.post<Order[]>(
      environment.apiUrl + "/orders/categories/orders",
      categories
    );
  }
}
