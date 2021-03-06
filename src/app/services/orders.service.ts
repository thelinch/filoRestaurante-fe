import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Category } from "../models/CategoryBodyRequestDto";
import { Order } from "../models/Order";
import { Socket } from "ngx-socket-io";
import { Table } from "../models/Table";
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
  listForTable(table: Table): Observable<Order[]> {
    return this.http.get<Order[]>(
      environment.apiUrl + "/orders/mesas/" + table.id + "/orders"
    );
  }
  getStates(): Observable<{ id: string; name: string; color: string }[]> {
    return this.http.get<{ id: string; name: string; color: string }[]>(
      environment.apiUrl + "/orders/states"
    );
  }
  changeState({
    id,
    type,
    name,
    statusId,
  }: {
    id: string;
    type: string;
    statusId: string;
    name?: string;
  }) {
    return this.http.post<void>(environment.apiUrl + "/orders/changeState", {
      id,
      type,
      statusId,
      name,
    });
  }
  create(order: Order) {
    return this.http.post<void>(environment.apiUrl + "/orders", order);
  }
  payment(orders: Order[]) {
    return this.http.post<void>(environment.apiUrl + "/orders/payment", orders);
  }
  paymentDelivery(ids: string[]) {
    return this.http.post<void>(
      environment.apiUrl + "/orders/paymentOnlyTypeDelivery",
      ids
    );
  }
  attend(orderId: string) {
    return this.http.get<void>(
      environment.apiUrl + "/orders/" + orderId + "/attend"
    );
  }
  ordersOnlyDelivery(): Observable<Order[]> {
    return this.http.get<Order[]>(
      environment.apiUrl + "/orders/ordersOnlyTypeDelivery"
    );
  }
  remove(orderId: string) {
    return this.http.get<void>(
      environment.apiUrl + "/orders/" + orderId + "/remove"
    );
  }
  reject(orderId: string) {
    return this.http.get<void>(
      environment.apiUrl + "/orders/" + orderId + "/reject"
    );
  }
  inProgress(orderId: string) {
    return this.http.get<void>(
      environment.apiUrl + "/orders/" + orderId + "/inProgress"
    );
  }
}
