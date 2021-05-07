import { HttpClient } from "@angular/common/http";
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
import { FactorMortalidad } from "src/app/models/factorMortalidad";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-factor",
  templateUrl: "./factor.component.html",
  styleUrls: ["./factor.component.scss"],
})
export class FactorComponent implements OnInit, OnDestroy {
  formularioFactor: FormGroup;

  editFactorEvent: Subscription;
  @ViewChild("editAndCreateFactorMortalidad")
  modalFormularioFactor: TemplateRef<any>;
  listaFactores: Array<FactorMortalidad>;
  isLoadingForms: Observable<boolean>;
  headerListaFactor = [
    {
      headerName: "F.Levante",
      bindValue: "factormort_lev",
      isActions: false,
    },
    {
      headerName: "F.M.Linea Hembra",
      bindValue: "factormort_prod_lh",
      isActions: false,
    },
    {
      headerName: "FM.Linea Macho",
      bindValue: "factormort_prod_lm",
      isActions: false,
    },
    {
      headerName: "F.Castigo",
      bindValue: "factorcastigo",
      isActions: false,
    },
    {
      headerName: "F.Bbs",
      bindValue: "factor_bbs",
      isActions: false,
    },
    {
      headerName: "F.Venta machos",
      bindValue: "factor_venta_macho",
      isActions: false,
    },
    { headerName: "Acciones", bindValue: "factorcastigo", isActions: true },
  ];
  constructor(
    private fb: FormBuilder,
    private enventService: EventService,
    private http: HttpClient,
    private modalService: NgbModal,
    private loadingService: LoaderService
  ) {
    this.listaFactores = [];
    this.isLoadingForms = this.loadingService.isLoading;
  }
  ngOnDestroy(): void {
    this.editFactorEvent?.unsubscribe();
  }

  ngOnInit(): void {
    this.listarFactores();
    this.crearFormularioFactor();
    this.editFactorEvent = this.enventService.subscribe(
      "editFactor",
      (factor: FactorMortalidad) => {
        this.editarFactor(factor);
      }
    );
  }
  async crearYEditarFactor(factor: FactorMortalidad) {
    this.formularioFactor.markAllAsTouched();
    if (this.formularioFactor.invalid) {
      return;
    }
    let url = environment.apiUrl + "/factor";
    if (factor.id > 0) {
      url = url.concat("/editar");
    }
    await this.http.post(url, factor).toPromise();
    this.modalService.dismissAll();
  }
  crearNuevoFactor() {
    this.formularioFactor.reset();
    this.modalService
      .open(this.modalFormularioFactor)
      .dismissed.subscribe(() => {
        this.listarFactores();
      });
  }
  editarFactor(factor: FactorMortalidad) {
    this.formularioFactor.patchValue(factor);
    this.modalService
      .open(this.modalFormularioFactor)
      .dismissed.subscribe(() => {
        this.listarFactores();
      });
  }
  get formularioFactorControles() {
    return this.formularioFactor.controls;
  }
  async listarFactores() {
    this.listaFactores = (
      await this.http
        .get<Array<FactorMortalidad>>(environment.apiUrl + "/factor/")
        .toPromise()
    ).map((factor, index) => ({
      ...factor,
      acciones: [
        `<div class="button-items">
    <button type="button" data-index=${index}   data-function="editFactor" class="btn btn-success buttonEvent mr2">Editar</button>
    </div>`,
      ],
    }));
  }
  crearFormularioFactor() {
    this.formularioFactor = this.fb.group({
      id: [0],
      factormort_lev: ["", [Validators.required]],
      factormort_prod_lh: ["", [Validators.required]],
      factormort_prod_lm: ["", [Validators.required]],
      factorcastigo: ["", [Validators.required]],
      factor_bbs: ["", [Validators.required]],
      factor_venta_macho: ["", [Validators.required]],
    });
  }
}
