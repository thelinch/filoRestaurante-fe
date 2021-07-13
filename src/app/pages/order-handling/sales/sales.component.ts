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
import { Order } from "src/app/models/Order";
import { Table } from "src/app/models/Table";
import { OrdersService } from "src/app/services/orders.service";
import { TableService } from "src/app/services/table.service";
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
    private orderService: OrdersService
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
      timer: 1500,
    });
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
