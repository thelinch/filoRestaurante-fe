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
  constructor(private http: HttpClient, private socket: Socket) {}
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
  create(order: Order) {
    return this.http.post<void>(environment.apiUrl + "/orders", order);
  }
  payment(orders: Order[]) {
    return this.http.post<void>(environment.apiUrl + "/orders/payment", orders);
  }
  connect() {
    return this.socket.on("connect", () => {
      console.log("connect");
    });
  }
  reciveOrder() {
    return this.socket.fromEvent("reciveOrder");
  }
}
