import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { EventService } from "src/app/core/services/event.service";
import { Order } from "src/app/models/Order";
import { OrderDetail } from "src/app/models/OrderDetail";
import { Product } from "src/app/models/Product";
import { Table } from "src/app/models/Table";
import { TypeOrder } from "src/app/models/TypeOrder";
import { OrdersService } from "src/app/services/orders.service";
import { ProductService } from "src/app/services/product.service";
import { TypeOrderService } from "src/app/services/type-order.service";
import Swal from "sweetalert2";
import util from "../../../../utils/util";
@Component({
  selector: "app-order-detail-form",
  templateUrl: "./order-detail-form.component.html",
  styleUrls: ["./order-detail-form.component.scss"],
})
export class OrderDetailFormComponent implements OnInit, OnDestroy {
  @Input() table: Table;
  formOrder: FormGroup;
  products: Product[];
  typeOrders: TypeOrder[] = [];
  @Output() onSuccessForm: EventEmitter<boolean> = new EventEmitter();
  @Input() dataForm: any;
  @Output() dataFormChange = new EventEmitter<any>();

  subscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private eventService: EventService,
    private orderService: OrdersService,
    private typeOrderService: TypeOrderService
  ) {
    this.products = [];
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.listProducts();
    this.listTypeOrders();
    this.createFormOrder();
    this.subscription = this.eventService.subscribe(
      "submitFormOrder",
      async (isSubmit) => {
        console.log("ENTROOOOO");
        await this.createOrder();
      }
    );
/*     if (this.dataForm) {
      this.orderDetails.removeAt(0);
      this.formOrder.patchValue({ type: this.dataForm.type });
      for (const orderDetail of this.dataForm?.orderDetails) {
        const formG = this.newOrderDetail();
        formG.patchValue(orderDetail);
        this.orderDetails.push(formG);
      }
    } */
    this.formOrder.valueChanges.subscribe((change) => {
      this.dataFormChange.emit(change);
    });
    this.formOrder.statusChanges.subscribe((change) => {
      this.onSuccessForm.emit(change == "VALID");
    });
  }

  async listProducts() {
    this.products = await this.productService.list().toPromise();
  }
  async listTypeOrders() {
    this.typeOrders = await this.typeOrderService.list().toPromise();
  }

  createFormOrder() {
    this.formOrder = this.fb.group({
      type: [null, [Validators.required]],

      orderDetails: this.fb.array([this.newOrderDetail()]),
    });
  }
  newOrderDetail() {
    return this.fb.group({
      product: [null, [Validators.required]],
      orderedQuantity: [1, [Validators.required, Validators.min(1)]],
      observation: [null],
    });
  }
  async createOrder() {
    this.formOrder.markAllAsTouched();
    this.orderDetails.markAllAsTouched();
    if (this.formOrder.invalid || this.orderDetails.invalid) {
      Swal.fire("", "El Formulario tiene errores", "error");
      return;
    }
    let orderModel: Order = this.formOrder.value as Order;
    orderModel.table = this.table;
    orderModel = util.generateId(orderModel);
    orderModel.orderDetails = orderModel.orderDetails.map((orderDetail) =>
      util.generateId(orderDetail)
    );
    await this.orderService.create(orderModel).toPromise();
    this.eventService.broadcast("orderCreated", {
      order: orderModel,
      table: this.table,
    });
    Swal.fire({
      toast: true,
      icon: "success",
      text: "la orden fue creada",
      position: "top-right",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  removeOrderDetail(index: number) {
    this.orderDetails.removeAt(index);
  }
  addAmount(indexOrderDetail: number) {
    const orderDetailsValues = this.orderDetails.value;
    if (
      orderDetailsValues[indexOrderDetail].orderedQuantity <
      orderDetailsValues[indexOrderDetail]?.product?.quantity
    ) {
      orderDetailsValues[indexOrderDetail].orderedQuantity += 1;
    }
    this.orderDetails.patchValue(orderDetailsValues);
  }
  substractAmount(indexOrderDetail: number) {
    const orderDetailsValues = this.orderDetails.value;
    if (
      indexOrderDetail == 0 &&
      orderDetailsValues[indexOrderDetail].orderedQuantity == 1
    ) {
      return;
    }
    orderDetailsValues[indexOrderDetail].orderedQuantity += -1;
    this.orderDetails.patchValue(orderDetailsValues);

    if (
      indexOrderDetail != 0 &&
      orderDetailsValues[indexOrderDetail].orderedQuantity == 0
    ) {
      this.removeOrderDetail(indexOrderDetail);
    }
  }
  addOrderDetail() {
    this.orderDetails.push(this.newOrderDetail());
  }

  get orderDetails(): FormArray {
    return this.formOrder.get("orderDetails") as FormArray;
  }
  get formOrderControls() {
    return this.formOrder.controls;
  }
}
