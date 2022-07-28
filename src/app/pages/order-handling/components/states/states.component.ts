import { Component, OnInit } from "@angular/core";
import { OrdersService } from "../../../../services/orders.service";

@Component({
  selector: "app-states",
  templateUrl: "./states.component.html",
  styleUrls: ["./states.component.scss"],
})
export class StatesComponent implements OnInit {
  states: { id: string; name: string; color: string }[] = [];
  constructor(private orderService: OrdersService) {}

  ngOnInit(): void {
    this.getStates();
  }

  async getStates() {
    this.states = await this.orderService.getStates().toPromise();
  }
}
