import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { EventService } from "src/app/core/services/event.service";
import { pedidoVentaDetalle } from "src/app/models/pedidoVentaDetalle";
import { PedidoService } from "src/app/services/pedido.service";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment";
import { TableCustomGenericComponent } from "../../table-custom-generic/table-custom-generic.component";
import { PedidoVenta } from "src/app/models/pedidoVenta";
import { Observable, of, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { FactorService } from "src/app/services/factor.service";

@Component({
  selector: "app-orders-form",
  templateUrl: "./orders-form.component.html",
  styleUrls: ["./orders-form.component.scss"],
})
export class OrdersFormComponent implements OnInit, AfterViewInit, OnDestroy {
  formGroupPedido: FormGroup;
  formGroupPedidoDetalle: FormGroup;
  @Input()
  pedidoVentaEdicion: PedidoVenta;
  headers = [
    { headerName: "Fecha Pedido", bindValue: "fechaPedido", isActions: false },
    {
      headerName: "Cantidad hembras",
      bindValue: "cantidadHembras",
      isActions: false,
    },
    {
      headerName: "Cantidad Machos",
      bindValue: "cantidadMachos",
      isActions: false,
    },
    { headerName: "Acciones", bindValue: "Acciones", isActions: true },
  ];
  listaPedidoDetalle: Array<pedidoVentaDetalle>;
  listaClientes: Array<any>;
  estaCargandoListaClientes: boolean;
  indiceEdicionPedidoDetalle: number;
  @Input()
  mostrarBotonSubmit: boolean;
  @ViewChild(TableCustomGenericComponent)
  tableGenerico: TableCustomGenericComponent;

  edicionPedidoDetalleSubscription: Subscription;
  eliminacionPedidoDetalleSubscription: Subscription;
  disabledSelectCliente: boolean;
  cantidadMachosValue: number;
  factorVentaMachos: number;
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private pedidoService: PedidoService,
    private factoService: FactorService
  ) {
    this.mostrarBotonSubmit = false;
    this.listaPedidoDetalle = [];
    this.listaClientes = [];
    this.estaCargandoListaClientes = true;
    this.indiceEdicionPedidoDetalle = -1;
    this.disabledSelectCliente = false;
    this.cantidadMachosValue = 0;
  }
  ngOnDestroy(): void {
    this.edicionPedidoDetalleSubscription?.unsubscribe();
    this.eliminacionPedidoDetalleSubscription?.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.rellenarFormularioParaLaEdicion();
    this.formGroupPedidoDetalle
      .get("cantidadHembras")
      .valueChanges.subscribe((value: number) => {
        this.cantidadMachosValue = value * this.factorVentaMachos;
      });
  }

  ngOnInit(): void {
    this.crearFormularioPedido();
    this.crearFormulatioPedidoDetale();
    this.listarFactor();
    this.listarClientes();

    this.edicionPedidoDetalleSubscription = this.eventService.subscribe(
      "editPedidoDetalle",
      (pedidoDetalle: pedidoVentaDetalle) => {
        this.editarPedidoVentaDetalle(pedidoDetalle);
      }
    );
    this.eliminacionPedidoDetalleSubscription = this.eventService.subscribe(
      "eliminarPedidoDetalle",
      (pedidoDetalle: pedidoVentaDetalle) => {
        this.eliminarPedidoVentaDetalle(pedidoDetalle);
      }
    );
  }
  rellenarFormularioParaLaEdicion() {
    if (this.pedidoVentaEdicion) {
      this.formGroupPedido.patchValue(this.pedidoVentaEdicion);
      this.disabledSelectCliente = true;
      this.listaPedidoDetalle = [
        ...this.pedidoVentaEdicion.detalles.map((detalle, index) => ({
          ...detalle,
          acciones: [
            `
        <button type="button" data-index=${index}   data-function="editPedidoDetalle" class="btn btn-success buttonEvent mr2">Editar</button>
        <button type="button" data-index=${index}  data-function="eliminarPedidoDetalle" class="btn buttonEvent btn- btn-danger">Eliminar</button>
       `,
          ],
        })),
      ];
      this.tableGenerico.setDataTable(this.listaPedidoDetalle);
    }
  }
  crearFormularioPedido() {
    this.formGroupPedido = this.fb.group({
      id: [0],
      cliente: [null, [Validators.required]],
      color: ["#13B97B", [Validators.required]],
    });
  }
  compareCliente(cliente: any, clientep: any) {
    return cliente?.CL_CNUMRUC == clientep?.CL_CNUMRUC;
  }
  crearFormulatioPedidoDetale() {
    this.formGroupPedidoDetalle = this.fb.group({
      id: [0],
      fechaPedido: [
        null,
        {
          validators: [Validators.required],
          asyncValidators: [
            this.validacionSoloLunesFecha(),
            this.validacionQueExistaSolaUnaFecha(),
          ],
          updateOn: "blur",
        },
      ],
      cantidadHembras: ["", [Validators.required, Validators.min(1)]],
    });
  }
  eliminarPedidoVentaDetalle(pedidoVentaDetalle: pedidoVentaDetalle) {
    const index = this.listaPedidoDetalle.findIndex(
      (pedido) => pedido.id == pedidoVentaDetalle.id
    );
    this.listaPedidoDetalle.splice(index, 1);
    this.tableGenerico.setDataTable(this.listaPedidoDetalle);
  }
  agregarPedidoDetalle(pedidoDetalleVenta: pedidoVentaDetalle) {
    if (this.formGroupPedidoDetalle.invalid) {
      this.formGroupPedidoDetalle.markAllAsTouched();
      return;
    }
    try {
      if (this.indiceEdicionPedidoDetalle >= 0) {
        this.listaPedidoDetalle[this.indiceEdicionPedidoDetalle] = {
          ...pedidoDetalleVenta,
          cantidadMachos: this.cantidadMachosValue,
          acciones: [
            `
        <button type="button" data-index=${this.indiceEdicionPedidoDetalle}   data-function="editPedidoDetalle" class="btn btn-success buttonEvent mr2">Editar</button>
        <button type="button" data-index=${this.indiceEdicionPedidoDetalle}  data-function="eliminarPedidoDetalle" class="btn buttonEvent btn- btn-danger">Eliminar</button>
       `,
          ],
        };
        this.tableGenerico.setDataTable(this.listaPedidoDetalle);
      } else {
        const lastIndex = this.listaPedidoDetalle.length;
        pedidoDetalleVenta.id = uuidv4();
        this.listaPedidoDetalle.push({
          ...pedidoDetalleVenta,
          cantidadMachos: this.cantidadMachosValue,
          acciones: [
            `
        <button type="button" data-index=${lastIndex}   data-function="editPedidoDetalle" class="btn btn-success buttonEvent mr2">Editar</button>
        <button type="button" data-index=${lastIndex}  data-function="eliminarPedidoDetalle" class="btn buttonEvent btn- btn-danger">Eliminar</button>
       `,
          ],
        });
        this.tableGenerico.setDataTable(this.listaPedidoDetalle);
      }
      this.formGroupPedidoDetalle.reset();
    } catch (error) {
      console.log("e", error);
    } finally {
      this.indiceEdicionPedidoDetalle = -1;
    }
  }
  editarPedidoVentaDetalle(pedidoVentaDetalle: pedidoVentaDetalle) {
    this.indiceEdicionPedidoDetalle = this.listaPedidoDetalle.findIndex(
      (pedido) => pedidoVentaDetalle.id == pedido.id
    );
    this.formGroupPedidoDetalle.patchValue(pedidoVentaDetalle);
  }
  async listarClientes() {
    this.estaCargandoListaClientes = true;
    this.listaClientes = await this.pedidoService.listarClientes().toPromise();
    this.estaCargandoListaClientes = false;
  }
  async listarFactor() {
    this.factorVentaMachos = (
      await this.factoService.listarFactores().toPromise()
    )[0].factor_venta_macho;
  }
  get formularioPedidoDetalleControles() {
    return this.formGroupPedidoDetalle.controls;
  }
  get formularioPedidoVentaControles() {
    return this.formGroupPedido.controls;
  }

  async creacionYEdicionDePedidoVenta() {
    const pedidoVenta = this.formGroupPedido.value as PedidoVenta;
    pedidoVenta.detalles = this.listaPedidoDetalle;
    if (!this.pedidoVentaEdicion) {
    }
    pedidoVenta.id = (!this.pedidoVentaEdicion && uuidv4()) || pedidoVenta.id;
    if (this.formGroupPedido.invalid) {
      return;
    }
    if (this.listaPedidoDetalle.length == 0) {
      Swal.fire({ text: "Al menos debe ingresar un detalle", icon: "error" });
      return;
    }
    if (this.pedidoVentaEdicion) {
      await this.pedidoService.editar(pedidoVenta).toPromise();
    } else {
      await this.pedidoService.crear(pedidoVenta).toPromise();
    }
    this.eventService.broadcast("submitSuccessPedidoVentaDetalle", {
      ...pedidoVenta,
      rucCliente: pedidoVenta["cliente"].CL_CNUMRUC,
      nombreCliente: pedidoVenta["cliente"].CL_CNOMCLI,
    });
    Swal.fire({
      title: `Se ${this.pedidoVentaEdicion ? "Edito" : "Grabo"} Correctamente `,
      icon: "success",
      timer: 1500,
    });
  }

  /**Validaciones formulario */

  validacionQueExistaSolaUnaFecha(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log("value", control.value);
      const fechaMoment = moment(control.value);
      let fechaEncontrada = this.listaPedidoDetalle.find(
        (pedidoDetalleVenta, index) =>
          pedidoDetalleVenta.fechaPedido == fechaMoment.format("YYYY-MM-DD")
      );
      if (this.indiceEdicionPedidoDetalle != -1) {
        fechaEncontrada = this.listaPedidoDetalle.find(
          (pedidoDetalleVenta, index) =>
            pedidoDetalleVenta.fechaPedido ==
              fechaMoment.format("YYYY-MM-DD") &&
            index != this.indiceEdicionPedidoDetalle
        );
      }
      return of(fechaEncontrada ? { invalidDate: true } : null);
    };
  }
  validacionSoloLunesFecha(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const fechaMoment = moment(control.value, "YYYY-MM-DD");
      return of(fechaMoment.day() == 1 ? null : { onlyLunes: true });
    };
  }
}
