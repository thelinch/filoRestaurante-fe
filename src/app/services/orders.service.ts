import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Category } from "../models/CategoryBodyRequestDto";
import { Order } from "../models/Order";
import { Socket } from "ngx-socket-io";
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
  create(order: Order) {
    return this.http.post<void>(environment.apiUrl + "/orders", order);
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
