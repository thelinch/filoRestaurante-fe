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
import { Table } from "src/app/models/Table";
import { TableService } from "src/app/services/table.service";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
})
export class SalesComponent implements OnInit, OnDestroy {
  tables$: Observable<Table[]>;
  tableSelected: Table;
  orderCreatedEventSubscription: Subscription;
  @ViewChild("editAndCreateOrder") modalFormOrder: TemplateRef<any>;

  constructor(
    private tableService: TableService,
    private modalService: NgbModal,
    private eventService: EventService
  ) {}
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
