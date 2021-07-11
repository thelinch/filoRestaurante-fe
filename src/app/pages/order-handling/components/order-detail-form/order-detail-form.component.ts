import { Component, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrderDetail } from "src/app/models/OrderDetail";
import { Product } from "src/app/models/Product";
import { Table } from "src/app/models/Table";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-order-detail-form",
  templateUrl: "./order-detail-form.component.html",
  styleUrls: ["./order-detail-form.component.scss"],
})
export class OrderDetailFormComponent implements OnInit {
  @Input() table: Table;
  formOrder: FormGroup;
  products: Product[];
  constructor(private fb: FormBuilder, private productService: ProductService) {
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
      orderedQuantity: [1, [Validators.required]],
    });
  }
  removeOrderDetail(index: number) {
    this.orderDetails.removeAt(index);
  }
  addAmount(indexOrderDetail: number) {
    const orderDetailsValues = this.orderDetails.value;
    orderDetailsValues[indexOrderDetail].orderedQuantity += 1;
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
