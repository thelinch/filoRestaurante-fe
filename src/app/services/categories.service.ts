import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Category } from "../models/CategoryBodyRequestDto";

@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  constructor(private http: HttpClient) {}
  list(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl + "/categories");
  }
  create(category: Category) {
    return this.http.post(environment.apiUrl + "/categories", category);
  }
  update(category: Category) {
    return this.http.post(
      environment.apiUrl + "/categories/" + category.id + "/update",
      category
    );
  }
  remove(categoryId: string) {
    return this.http.delete(environment.apiUrl + "/categories/" + categoryId);
  }
}
