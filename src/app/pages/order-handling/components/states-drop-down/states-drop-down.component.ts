import { Component, Input, OnInit } from "@angular/core";
import { StatusModel } from "../../../../models/StatusModel";

@Component({
  selector: "app-states-drop-down",
  templateUrl: "./states-drop-down.component.html",
  styleUrls: ["./states-drop-down.component.scss"],
})
export class StatesDropDownComponent implements OnInit {
  @Input() state: StatusModel;
  constructor() {}

  ngOnInit(): void {}
}
