import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { Table } from "src/app/models/Table";
import { TableService } from "src/app/services/table.service";

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
})
export class SalesComponent implements OnInit {
  tables$: Observable<Table[]>;
  @ViewChild("editAndCreateOrder") modalFormOrder: TemplateRef<any>;

  constructor(
    private tableService: TableService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listTables();
  }
  newOrder() {
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
