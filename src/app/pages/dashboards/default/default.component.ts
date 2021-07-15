import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subject, Subscription } from "rxjs";
import StateDashboard from "./stateDashboard";
import { IngresoLote } from "src/app/models/IngresoLote";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import ItemsDashboard from "./itemsDashboard";
import { IngresoLoteService } from "src/app/services/ingreso-lote.service";

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit, OnDestroy {
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private ingresoLoteRepository: IngresoLoteService
  ) {}
  ngOnDestroy(): void {}

  async ngOnInit() {}
}
