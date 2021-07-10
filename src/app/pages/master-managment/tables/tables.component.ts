import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { Table } from "src/app/models/Table";
import { TableService } from "src/app/services/table.service";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.scss"],
})
export class TablesComponent implements OnInit, OnDestroy {
  formTable: FormGroup;
  isLoadingForm: Observable<boolean>;
  subscriptionEditTableEvent: Subscription;
  subscriptionRemoveTableEvent: Subscription;
  tables: Table[];
  @ViewChild("editAndCreateTable") modalFormTable: TemplateRef<any>;

  headerTables = [
    {
      headerName: "Mesa",
      bindValue: "name",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Acciones",
      bindValue: "name",
      isActions: true,
      isTemplate: false,
    },
  ];
  constructor(
    private fb: FormBuilder,
    private loadingService: LoaderService,
    private tableService: TableService,
    private modalService: NgbModal,
    private eventService: EventService
  ) {
    this.isLoadingForm = loadingService.isLoading;
  }
  ngOnDestroy(): void {
    this.subscriptionEditTableEvent?.unsubscribe();
    this.subscriptionRemoveTableEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.listTables();
    this.createFormTable();
    this.subscriptionEditTableEvent = this.eventService.subscribe(
      "editEventTable",
      (table: Table) => {
        this.editTable(table);
      }
    );
    this.subscriptionRemoveTableEvent = this.eventService.subscribe(
      "removeEventTable",
      (table: Table) => {
        this.removeTable(table.id);
      }
    );
  }

  async listTables() {
    this.tables = (await this.tableService.list().toPromise()).map(
      (factor, index) => ({
        ...factor,
        acciones: [
          `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editEventTable" class="btn btn-success buttonEvent mr2">Editar</button>
    <button type="button" data-index=${index}   data-function="removeEventTable" class="btn btn-danger buttonEvent mr2">eliminar</button>
    </div>`,
        ],
      })
    );
  }
  async createAndEditTable() {
    const table = this.formTable.value as Table;
    console.log(table);
    const uuid = uuidv4();
    if (!table.id) {
      await this.tableService.save({ ...table, id: uuid }).toPromise();
    } else {
      await this.tableService.update(table).toPromise();
    }
    Swal.fire({
      icon: "success",
      text: `Se ${table.id != null ? "edito" : "creo"} correctamente`,
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
    });
    table.id = uuid;
    await this.listTables();
    this.modalService.dismissAll();
  }
  createFormTable() {
    this.formTable = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
    });
  }
  async removeTable(tableId: string) {
    await this.tableService.remove(tableId).toPromise();
    Swal.fire({
      icon: "success",
      text: `Se elimino  correctamente`,
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
    });
    await this.listTables();
  }
  newTable() {
    this.formTable.reset();
    this.modalService.open(this.modalFormTable);
  }

  editTable(table: Table) {
    this.formTable.patchValue(table);
    this.modalService.open(this.modalFormTable);
  }
  get formTableControls() {
    return this.formTable.controls;
  }
}
