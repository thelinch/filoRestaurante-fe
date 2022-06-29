import { OnDestroy } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { DndDropEvent } from "ngx-drag-drop";
import { Subscription } from "rxjs";
import { OrderState } from "src/app/core/states/OrderState";
import { OrderEventState } from "src/app/events/orderEventState";
import { Category } from "src/app/models/CategoryBodyRequestDto";
import { Order } from "src/app/models/Order";
import { CategoriesService } from "src/app/services/categories.service";
import { OrdersService } from "src/app/services/orders.service";
import { WebsocketService } from "src/app/services/websocket.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit, OnDestroy {
  columns: any[];
  categories: Category[];
  isLoadingCategories: boolean;
  categoriesSelected: Category[];
  orderEventReciveEvent: Subscription;
  columnSource: any;
  colmnDestine: any;
  constructor(
    private categoryService: CategoriesService,
    private orderService: OrdersService,
    private webSocketService: WebsocketService
  ) {
    this.columns = [
      {
        id: uuidv4(),
        title: "Pedidos",
        items: [],
        states: [OrderState.CREADO],
        statesPermit: [],
      },
      {
        id: uuidv4(),
        title: "En Realizacion",
        items: [],
        states: [OrderState.ENREALIZACION],
        statesPermit: ["Pedidos"],
      },
      {
        id: uuidv4(),
        title: "Atendidos",
        items: [],
        states: [OrderState.ATENDIDO, OrderState.PAGADO],
        statesPermit: ["En Realizacion"],
      },
      {
        id: uuidv4(),
        title: "Rechazados",
        items: [],
        states: [OrderState.RECHAZADO],
        statesPermit: ["Pedidos", "En Realizacion"],
      },
    ];
    this.categories = [];
    this.categoriesSelected = [];
  }
  ngOnDestroy(): void {
    this.orderEventReciveEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.listarCategorias();
    this.orderEventReciveEvent = this.webSocketService
      .reciveEvent(OrderEventState.ReciveOrder)
      .subscribe((order: Order) => {
        console.log("Order", order);
        const music = new Audio("assets/sounds/samsung_silbido_mensaje.mp3");

        const categoiesSelectedName = this.categoriesSelected.map(
          (c) => c.name
        );
        const hasContainsCategory =
          []
            .concat(
              ...order.orderDetails.map((oD) =>
                oD.product.categories.map((c) => c.name)
              )
            )
            .filter((c) => categoiesSelectedName.includes(c)).length > 0;
        if (hasContainsCategory) {
          this.columns[0].items.push(order);
          music.play();
        }
      });
  }
  async listOrderForCategories() {
    if (this.categoriesSelected.length > 0) {
      const orders: Order[] = await this.orderService
        .listForCategories(this.categoriesSelected)
        .toPromise();
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i].items = orders.filter((o) =>
          this.columns[i].states.includes(o.state)
        );
      }
    }
  }
  onDragMoved(event, column: any, indexItem: number) {
    this.columnSource = column;
  }
  async onDragEnd(event, indexItem: number) {
    if (!this.colmnDestine?.statesPermit.includes(this.columnSource?.title)) {
      return;
    }

    const indexColumn = this.columns.findIndex(
      (c) => c.id == this.columnSource?.id
    );
    const listItems = this.columns[indexColumn].items;
    listItems.splice(indexItem, 1);
    if (this.columnSource?.id !== this.colmnDestine?.id) {
      this.columns[indexColumn].items = listItems;
    }
  }
  onDrop(event: DndDropEvent, column: any) {
    this.colmnDestine = column;
    if (!this.colmnDestine.statesPermit.includes(this.columnSource.title)) {
      return;
    }
    const order = event.data as Order;
    if (this.colmnDestine.title == "En Realizacion") {
      this.orderService.inProgress(order.id).toPromise();
    }
    if (this.colmnDestine.title == "Atendidos") {
      this.orderService.attend(order.id).toPromise();
    }
    if (this.colmnDestine.title == "Rechazados") {
      this.orderService.reject(order.id).toPromise();
    }
    const index = this.columns.findIndex((c) => c.id == column.id);
    this.columns[index].items = [...this.columns[index].items, event.data];
  }
  async listarCategorias() {
    this.isLoadingCategories = true;
    this.categories = await this.categoryService.list().toPromise();
    this.isLoadingCategories = false;
  }
}
