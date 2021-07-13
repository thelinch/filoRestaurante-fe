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
  orders: Order[];
  totalPaymentForOrder: number;
  @ViewChild("editAndCreateOrder") modalFormOrder: TemplateRef<any>;
  @ViewChild("sales") modalSales: TemplateRef<any>;

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
    this.websocketService
      .reciveEvent(OrderEventState.AttendOrder)
      .subscribe((order: Order) => {
        //TODO:falta integrar el sonido
        Swal.fire({
          text: `La orden para la mesa ${order.table?.name} esta lista!!`,
          icon: "info",
          toast: true,
          confirmButtonText: "Entendido",
          position: "top-right",
        });
      });
  }
  async listOrderFindTable(table: Table) {
    this.tableSelected = table;
    this.orders = await this.orderService.listForTable(table).toPromise();
    this.modalService.open(this.modalSales);
    this.totalPaymentForOrder = this.orders.reduce((prev, curr) => {
      prev += curr.total;
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
    this.modalService.dismissAll()
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
}
