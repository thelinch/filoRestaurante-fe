import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { TypeOrder } from "src/app/models/TypeOrder";
import { TypeOrderService } from "src/app/services/type-order.service";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-type-orders",
  templateUrl: "./type-orders.component.html",
  styleUrls: ["./type-orders.component.scss"],
})
export class TypeOrdersComponent implements OnInit {
  typeOrders: TypeOrder[] = [];
  form: FormGroup;
  subscriptionEditCategoryEvent: Subscription;
  subscriptionRemoveCategoryEvent: Subscription;
  @ViewChild("editAndCreateCategory") modalFormCategory: TemplateRef<any>;

  headerTables = [
    {
      headerName: "Nombre",
      bindValue: "name",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Precio adicional",
      bindValue: "price",
      isActions: false,
      isTemplate: false,
    },
    {
      headerName: "Color",
      bindValue: "color",
      isActions: false,
      isTemplate: false,
    },

    {
      headerName: "Acciones",
      bindValue: "ss",
      isActions: true,
      isTemplate: false,
    },
  ];
  isLoadingForm: Observable<boolean>;
  constructor(
    private fb: FormBuilder,
    private typeOrderService: TypeOrderService,
    private modalService: NgbModal,
    private eventService: EventService,
    private loadingService: LoaderService
  ) {
    this.isLoadingForm = loadingService.isLoading;
  }
  ngOnDestroy(): void {
    this.subscriptionEditCategoryEvent?.unsubscribe();
    this.subscriptionRemoveCategoryEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.createFormCategory();
    this.listCategory();
    this.subscriptionEditCategoryEvent = this.eventService.subscribe(
      "editEventTypeOrder",
      (table: TypeOrder) => {
        this.editTypeOrder(table);
      }
    );
  }
  createFormCategory() {
    this.form = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      color: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });
  }
  newCategory() {
    this.form.reset();
    this.modalService.open(this.modalFormCategory);
  }
  async listCategory() {
    this.typeOrders = (await this.typeOrderService.list().toPromise()).map(
      (factor, index) => ({
        ...factor,
        acciones: [
          `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editEventTypeOrder" class="btn btn-success buttonEvent mr2">Editar</button>
    </div>`,
        ],
      })
    );
  }
  async createAndEditTypeOrder() {
    const typeOrder = this.form.value as TypeOrder;
    const uuid = uuidv4();
    if (!typeOrder.id) {
      await this.typeOrderService
        .create({ ...typeOrder, id: uuid })
        .toPromise();
    } else {
      await this.typeOrderService.update(typeOrder).toPromise();
    }
    Swal.fire({
      icon: "success",
      text: `Se ${typeOrder.id != null ? "edito" : "creo"} correctamente`,
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
    });
    typeOrder.id = uuid;
    this.modalService.dismissAll();

    await this.listCategory();
  }
  editTypeOrder(typeOrder: TypeOrder) {
    this.form.patchValue(typeOrder);
    this.modalService.open(this.modalFormCategory);
  }

  get formCategoryControls() {
    return this.form.controls;
  }
}
