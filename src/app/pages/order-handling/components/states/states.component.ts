import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { EventService } from "../../../../core/services/event.service";
import { StatusModel } from "../../../../models/StatusModel";
import { OrdersService } from "../../../../services/orders.service";

@Component({
  selector: "app-states",
  templateUrl: "./states.component.html",
  styleUrls: ["./states.component.scss"],
})
export class StatesComponent implements OnInit {
  states: { id: string; name: string; color: string }[] = [];
  @Input() objectId: string | any;

  constructor(
    private orderService: OrdersService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.getStates();
  }

  async getStates() {
    this.states = await this.orderService.getStates().toPromise();
  }
  selectState(state: StatusModel) {
    this.eventService.broadcast("changeState", {
      newState: state,
      objectId: this.objectId,
    });
  }
}
