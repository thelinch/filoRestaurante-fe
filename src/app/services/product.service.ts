import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Product } from "../models/Product";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

  list(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.apiUrl + "/products/");
  }
  create(product: Product) {
    return this.http.post(environment.apiUrl + "/products", product);
  }
  update(product: Product) {
    return this.http.post(
      environment.apiUrl + "/products/" + product.id + "/update",
      product
    );
  }
  remove(productId: string) {
    return this.http.delete(environment.apiUrl + "/products/" + productId);
  }
}
