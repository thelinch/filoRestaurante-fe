import { Component, OnInit } from "@angular/core";
import { OrderState } from "src/app/core/states/OrderState";
import { Category } from "src/app/models/CategoryBodyRequestDto";
import { CategoriesService } from "src/app/services/categories.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit {
  columns: any[];
  categories: Category[];
  isLoadingCategories: boolean;
  categoriesSelected: Category[];
  constructor(private categoryService: CategoriesService) {
    this.columns = [
      { title: "Pedidos", items: [], states: [OrderState.CREADO] },
      {
        title: "En Realizacion",
        items: [],
        states: [OrderState.ENREALIZACION],
      },
      { title: "Atendidos", items: [], states: [OrderState.ATENDIDO] },
      { title: "Rechazados", items: [], states: [OrderState.RECHAZADO] },
    ];
    this.categories = [];
    this.categoriesSelected = [];
  }

  ngOnInit(): void {
    this.listarCategorias();
  }
  changeCategoriesSelected() {
    console.log("c", this.categoriesSelected);
  }
  async listarCategorias() {
    this.isLoadingCategories = true;
    this.categories = await this.categoryService.list().toPromise();
    this.isLoadingCategories = false;
  }
}
