import { Component, OnInit } from "@angular/core";
import { DndDropEvent } from "ngx-drag-drop";
import { OrderState } from "src/app/core/states/OrderState";
import { Category } from "src/app/models/CategoryBodyRequestDto";
import { Order } from "src/app/models/Order";
import { CategoriesService } from "src/app/services/categories.service";
import { OrdersService } from "src/app/services/orders.service";
import { v4 as uuidv4 } from "uuid";

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
  columnSource: any;
  colmnDestine: any;
  constructor(
    private categoryService: CategoriesService,
    private orderService: OrdersService
  ) {
    this.columns = [
      {
        id: uuidv4(),
        title: "Pedidos",
        items: [],
        states: [OrderState.CREADO],
      },
      {
        id: uuidv4(),
        title: "En Realizacion",
        items: [],
        states: [OrderState.ENREALIZACION],
      },
      {
        id: uuidv4(),
        title: "Atendidos",
        items: [],
        states: [OrderState.ATENDIDO],
      },
      {
        id: uuidv4(),
        title: "Rechazados",
        items: [],
        states: [OrderState.RECHAZADO],
      },
    ];
    this.categories = [];
    this.categoriesSelected = [];
  }

  ngOnInit(): void {
    this.listarCategorias();
  }
  async listOrderForCategories() {
    const orders: Order[] = await this.orderService
      .listForCategories(this.categoriesSelected)
      .toPromise();
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].items = orders.filter((o) =>
        this.columns[i].states.includes(o.state)
      );
    }
  }
  onDragMoved(event, column: any, indexItem: number) {
    this.columnSource = column;
    const indexColumn = this.columns.findIndex((c) => c.id == column.id);
    const listItems = this.columns[indexColumn].items;
    listItems.splice(indexItem, 1);
    if (this.columnSource?.id !== this.colmnDestine?.id) {
      this.columns[indexColumn].items = listItems;
    }
  }

  onDrop(event: DndDropEvent, column: any) {
    this.colmnDestine = column;
    const index = this.columns.findIndex((c) => c.id == column.id);
    this.columns[index].items = [...this.columns[index].items, event.data];
  }
  async listarCategorias() {
    this.isLoadingCategories = true;
    this.categories = await this.categoryService.list().toPromise();
    this.isLoadingCategories = false;
  }
}
