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
import { EventService } from "../../../core/services/event.service";
import { StatusModel } from "../../../models/StatusModel";

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
  columnSource: any;
  colmnDestine: any;
  states: { id: string; name: string; color: string; items: any[] }[] = [];
  subscriptions: Subscription;
  constructor(
    private categoryService: CategoriesService,
    private orderService: OrdersService,
    private webSocketService: WebsocketService,
    private eventService: EventService
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
    this.subscriptions?.unsubscribe();
  }

  ngOnInit(): void {
    this.listarCategorias();
    this.getStates();
    this.subscriptions = this.webSocketService
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
          this.states[0].items.push(order);
          music.play();
        }
      });
   
    const subscriptionChangeStateEvent = this.eventService.subscribe(
      "changeState",
      ({ newState, objectId }: { newState: StatusModel; objectId: string }) => {
        let orderDetailName = "";
        for (const state of this.states) {
          for (const item of state.items) {
            const indexOrderDetail = item.orderDetails.findIndex(
              (o) => o.id == objectId
            );
            if (indexOrderDetail >= 0) {
              item.orderDetails[indexOrderDetail].status = newState;
              orderDetailName = item.orderDetails[indexOrderDetail].name;
            }
          }
        }
        this.orderService
          .changeState({
            id: objectId,
            statusId: newState.id,
            name: orderDetailName,
            type: "orderDetail",
          })
          .toPromise();
      }
    );
    this.subscriptions.add(subscriptionChangeStateEvent);
  }

  async getStates() {
    const states = await this.orderService.getStates().toPromise();
    this.states = states.map((a) => ({ ...a, items: [] }));
  }
  async listOrderForCategories() {
    if (this.categoriesSelected.length > 0) {
      const orders: Order[] = await this.orderService
        .listForCategories(this.categoriesSelected)
        .toPromise();
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].items = orders.filter(
          (o) => this.states[i].id === o.status.id
        );
      }
    }
  }
  onDragMoved(event, column: any, indexItem: number) {
    this.columnSource = column;
  }
  async onDragEnd(event, indexItem: number) {
    const indexColumn = this.states.findIndex(
      (c) => c.id === this.columnSource?.id
    );
    if (indexColumn >= 0 && this.columnSource?.id !== this.colmnDestine?.id) {
      const listItems = this.states[indexColumn].items;
      listItems.splice(indexItem, 1);
      this.states[indexColumn].items = listItems;
    }
  }
  onDrop(event: DndDropEvent, column: any) {
    this.colmnDestine = column;
    const index = this.states.findIndex((c) => c.id === column.id);
    if (index >= 0 && this.colmnDestine !== this.columnSource) {
      const newState = this.states[index];
      this.states[index].items = [...this.states[index].items, event.data];
      this.orderService
        .changeState({
          id: event.data.id,
          statusId: newState.id,
          type: "order",
        })
        .toPromise();
    }
  }
  async listarCategorias() {
    this.isLoadingCategories = true;
    this.categories = await this.categoryService.list().toPromise();
    this.isLoadingCategories = false;
  }
}
