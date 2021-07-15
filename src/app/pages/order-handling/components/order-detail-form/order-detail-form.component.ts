import { Component, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventService } from "src/app/core/services/event.service";
import { Order } from "src/app/models/Order";
import { OrderDetail } from "src/app/models/OrderDetail";
import { Product } from "src/app/models/Product";
import { Table } from "src/app/models/Table";
import { OrdersService } from "src/app/services/orders.service";
import { ProductService } from "src/app/services/product.service";
import Swal from "sweetalert2";
import util from "../../../../utils/util";
@Component({
  selector: "app-order-detail-form",
  templateUrl: "./order-detail-form.component.html",
  styleUrls: ["./order-detail-form.component.scss"],
})
export class OrderDetailFormComponent implements OnInit {
  @Input() table: Table;
  formOrder: FormGroup;
  products: Product[];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private eventService: EventService,
    private orderService: OrdersService
  ) {
    this.products = [];
  }

  ngOnInit(): void {
    this.listProducts();
    this.createFormOrder();
  }

  async listProducts() {
    this.products = await this.productService.list().toPromise();
  }

  createFormOrder() {
    this.formOrder = this.fb.group({
      observation: [null],
      orderDetails: this.fb.array([this.newOrderDetail()]),
    });
  }
  newOrderDetail() {
    return this.fb.group({
      product: [null, [Validators.required]],
      orderedQuantity: [1, [Validators.required, Validators.min(1)]],
    });
  }
  async createOrder() {
    this.formOrder.markAllAsTouched();
    this.orderDetails.markAllAsTouched();
    if (this.formOrder.invalid || this.orderDetails.invalid) {
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
      orderDetailsValues[indexOrderDetail].product.quantity
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
