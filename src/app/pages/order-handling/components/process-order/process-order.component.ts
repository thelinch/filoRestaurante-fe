import { Component, Input, OnInit } from "@angular/core";
import { EventService } from "src/app/core/services/event.service";

@Component({
  selector: "app-process-order",
  templateUrl: "./process-order.component.html",
  styleUrls: ["./process-order.component.scss"],
})
export class ProcessOrderComponent implements OnInit {
  @Input() table: any;
  tabsDisabled = {
    confirm: true,
  };
  activeIdNav = 1;
  dataForm: any;
  totalPayment = 0;
  constructor(private eventService: EventService) {}

  ngOnInit(): void {}
  setSucessForm(statuChange: boolean): void {
    this.tabsDisabled.confirm = !statuChange;
  }
  createOrder() {
    console.log("CREACION ORDEn");
    this.eventService.broadcast("submitFormOrder", { algo: true });
  }
  showConfirmTab() {
    this.activeIdNav = 2;
    console.log("data", this.dataForm);
    const totalPayment = this.dataForm.orderDetails.reduce(
      (prev, curr) => (prev += curr.product.price * curr.orderedQuantity),
      0
    );
    this.totalPayment = Number(
      (Number(totalPayment) + Number(this.dataForm.type.price)).toFixed(2)
    );
  }
}
