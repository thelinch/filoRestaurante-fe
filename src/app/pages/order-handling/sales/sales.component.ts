import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { OrderEventState } from "src/app/events/orderEventState";
import { Order } from "src/app/models/Order";
import { Table } from "src/app/models/Table";
import { OrdersService } from "src/app/services/orders.service";
import { TableService } from "src/app/services/table.service";
import { WebsocketService } from "src/app/services/websocket.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
})
export class SalesComponent implements OnInit, OnDestroy {
  tables$: Observable<Table[]>;
  tableSelected: Table;
  orderCreatedEventSubscription: Subscription;
  orderAttendEventSubscription: Subscription;

  orders: Order[];
  totalPaymentForOrder: number;
  @ViewChild("editAndCreateOrder") modalFormOrder: TemplateRef<any>;
  @ViewChild("sales") modalSales: TemplateRef<any>;
  @ViewChild("salesDelivery") modalSalesDelivery: TemplateRef<any>;
  orderOnlyDelivery: Order[] = [];
  isLoadingOrdersDelivery = false;
  constructor(
    private tableService: TableService,
    private modalService: NgbModal,
    private eventService: EventService,
    private orderService: OrdersService,
    private websocketService: WebsocketService
  ) {
    this.orders = [];
    this.totalPaymentForOrder = 0;
  }
  ngOnDestroy(): void {
    this.orderCreatedEventSubscription?.unsubscribe();
    this.orderAttendEventSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.listTables();
    this.orderCreatedEventSubscription = this.eventService.subscribe(
      "orderCreated",
      ({ order, table }) => {
        this.modalService.dismissAll();
        this.listTables();
      }
    );
    this.orderAttendEventSubscription = this.websocketService
      .reciveEvent(OrderEventState.itemLastState)
      .subscribe(
        ({
          tableName,
          productName,
        }: {
          tableName: string;
          productName: string;
        }) => {
          const music = new Audio("assets/sounds/sonido-orden-atendida.mp3");
          music.play();
          Swal.fire({
            text: `El producto ${productName} ${
              tableName ? `para la mesa ${tableName}` : ""
            } esta lista!!`,
            icon: "info",
            toast: true,
            confirmButtonText: "Entendido",
            position: "top-right",
          });
        }
      );
  }

  async listOrderFindTable(table: Table) {
    this.tableSelected = table;
    this.orders = await this.orderService.listForTable(table).toPromise();
    this.modalService.open(this.modalSales);
    this.totalPaymentForOrder = this.orders.reduce((prev, curr) => {
      prev += Number(curr.total);
      return prev;
    }, 0);
  }
  async payment() {
    await this.orderService.payment(this.orders).toPromise();
    Swal.fire({
      toast: true,
      text: "Se creo el pago exitosamente",
      icon: "success",
      showConfirmButton: false,
      position: "top-right",
      timer: 2000,
    });
    this.modalService.dismissAll();
    this.listTables();
  }
  newOrder(table: Table) {
    this.tableSelected = table;
    this.modalService.open(this.modalFormOrder, {
      size: "lg",
      keyboard: false,
      backdrop: "static",
    });
  }
  listTables() {
    this.tables$ = this.tableService.list();
  }
  async loadOrdersOnlyDelivery() {
    try {
      this.isLoadingOrdersDelivery = true;
      this.orderOnlyDelivery = await this.orderService
        .ordersOnlyDelivery()
        .toPromise();
      this.modalService.open(this.modalSalesDelivery, {
        size: "lg",
        keyboard: false,
        backdrop: "static",
      });
    } catch (error) {
    } finally {
      this.isLoadingOrdersDelivery = false;
    }
  }

  async paymentDelivery(id: string) {
    await this.orderService.paymentDelivery([id]).toPromise();
    Swal.fire({
      toast: true,
      text: "Se creo correctamente el pago",
      icon: "success",
      timer: 2500,
      position: "top-right",
    });
  }
}
