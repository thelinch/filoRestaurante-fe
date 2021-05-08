import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventService } from "src/app/core/services/event.service";
import { pedidoVentaDetalle } from "src/app/models/pedidoVentaDetalle";
import { PedidoService } from "src/app/services/pedido.service";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment";
import { TableCustomGenericComponent } from "../../table-custom-generic/table-custom-generic.component";
import { PedidoVenta } from "src/app/models/pedidoVenta";
@Component({
  selector: "app-orders-form",
  templateUrl: "./orders-form.component.html",
  styleUrls: ["./orders-form.component.scss"],
})
export class OrdersFormComponent implements OnInit, AfterViewInit {
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

    { headerName: "Acciones", bindValue: "Acciones", isActions: true },
  ];
  listaPedidoDetalle: Array<pedidoVentaDetalle>;
  listaClientes: Array<any>;
  estaCargandoListaClientes: boolean;
  estaEditandoPedidoVentaDetalle: boolean;
  @Input()
  mostrarBotonSubmit: boolean;
  @ViewChild(TableCustomGenericComponent)
  tableGenerico: TableCustomGenericComponent;
  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private pedidoService: PedidoService
  ) {
    this.mostrarBotonSubmit = false;
    this.listaPedidoDetalle = [];
    this.listaClientes = [];
    this.estaCargandoListaClientes = true;
    this.estaEditandoPedidoVentaDetalle = false;
  }
  ngAfterViewInit(): void {
    this.rellenarFormularioParaLaEdicion();
  }

  ngOnInit(): void {
    this.crearFormularioPedido();
    this.crearFormulatioPedidoDetale();
    this.listarClientes();
    this.eventService.subscribe(
      "editPedidoDetalle",
      (pedidoDetalle: pedidoVentaDetalle) => {
        this.editarPedidoVentaDetalle(pedidoDetalle);
      }
    );
    this.eventService.subscribe(
      "eliminarPedidoDetalle",
      (pedidoDetalle: pedidoVentaDetalle) => {
        console.log("eliemina", pedidoDetalle);
      }
    );
  }
  rellenarFormularioParaLaEdicion() {
    if (this.pedidoVentaEdicion) {
      this.formGroupPedido
        .get("cliente")
        .patchValue(this.pedidoVentaEdicion.rucCliente);
      console.log("lista", this.pedidoVentaEdicion.detalles);
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
    });
  }
  compareCliente(cliente: any, rucCliente: string) {
    return cliente?.CL_CNUMRUC == rucCliente;
  }
  crearFormulatioPedidoDetale() {
    this.formGroupPedidoDetalle = this.fb.group({
      id: [0],
      fechaPedido: [
        null,
        {
          validators: [Validators.required],
          //asyncValidators: [this.pedidoService.fechaValidator()],
          updateOn: "blur",
        },
      ],
      cantidadHembras: ["", [Validators.required, Validators.min(1)]],
    });
  }
  agregarPedidoDetalle(pedidoDetalleVenta: pedidoVentaDetalle) {
    if (this.formGroupPedidoDetalle.invalid) {
      this.formGroupPedidoDetalle.markAllAsTouched();
      return;
    }
    try {
      if (this.estaEditandoPedidoVentaDetalle) {
        const index = this.listaPedidoDetalle.findIndex(
          (pedido) => pedido.id == pedidoDetalleVenta.id
        );
        this.listaPedidoDetalle[index] = {
          ...pedidoDetalleVenta,
          acciones: [
            `
        <button type="button" data-index=${index}   data-function="editPedidoDetalle" class="btn btn-success buttonEvent mr2">Editar</button>
        <button type="button" data-index=${index}  data-function="eliminarPedidoDetalle" class="btn buttonEvent btn- btn-danger">Eliminar</button>
       `,
          ],
        };
        this.tableGenerico.setDataTable(this.listaPedidoDetalle);
      } else {
        const errors = this.validarListaPedidoVentaDetalle(pedidoDetalleVenta);
        if (errors.length > 0) {
          Swal.fire({
            icon: "error",
            html: `
           <ul>
           ${errors.map(
             (err) =>
               `
            <li>${err}</li>
              `
           )}</ul>
           `,
          });
          return;
        }
        const lastIndex = this.listaPedidoDetalle.length;
        pedidoDetalleVenta.id = uuidv4();
        console.log("entro", pedidoDetalleVenta);
        this.listaPedidoDetalle.push({
          ...pedidoDetalleVenta,
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
      this.estaEditandoPedidoVentaDetalle = false;
    }
  }
  editarPedidoVentaDetalle(pedidoVentaDetalle: pedidoVentaDetalle) {
    this.estaEditandoPedidoVentaDetalle = true;
    this.formGroupPedidoDetalle.patchValue(pedidoVentaDetalle);
  }
  async listarClientes() {
    this.estaCargandoListaClientes = true;
    this.listaClientes = await this.pedidoService.listarClientes().toPromise();
    this.estaCargandoListaClientes = false;
  }
  get formularioPedidoDetalleControles() {
    return this.formGroupPedidoDetalle.controls;
  }
  get formularioPedidoVentaControles() {
    return this.formGroupPedido.controls;
  }
  validarListaPedidoVentaDetalle(
    pedidoVentaDetalle: pedidoVentaDetalle
  ): Array<string> {
    const error = [];
    const fechaMoment = moment(
      pedidoVentaDetalle.fechaPedido,
      "YYYY-MM-DD",
      true
    );

    if (this.validarSiExisteFechaListaPedidoVentaDetalle(pedidoVentaDetalle)) {
      error.push("Ya existe una fecha registrada");
    }

    if (fechaMoment.day() != 1) {
      error.push("Solo es permitido los dias lunes");
    }
    return error;
  }
  validarSiExisteFechaListaPedidoVentaDetalle(
    pedidoVentaDetalle: pedidoVentaDetalle
  ): boolean {
    return this.listaPedidoDetalle
      .map((pedido) => pedido.fechaPedido)
      .includes(pedidoVentaDetalle.fechaPedido);
  }
  async creacionYEdicionDePedidoVenta() {
    const pedidoVenta = this.formGroupPedido.value as PedidoVenta;
    pedidoVenta.detalles = this.listaPedidoDetalle;
    pedidoVenta.id = uuidv4();
    if (this.formGroupPedido.invalid) {
      Swal.fire({ text: "Debe elegir un cliente", icon: "error" });
      return;
    }
    if (this.listaPedidoDetalle.length == 0) {
      Swal.fire({ text: "Al menos debe ingresar un detalle", icon: "error" });
      return;
    }
    await this.pedidoService.crear(pedidoVenta).toPromise();
    this.eventService.broadcast("submitSuccessPedidoVentaDetalle", {
      ...pedidoVenta,
      rucCliente: pedidoVenta["cliente"].CL_CNUMRUC,
      nombreCliente: pedidoVenta["cliente"].CL_CNOMCLI,
    });
    Swal.fire({
      title: "Se",
      icon: "success",
      timer: 1500,
    });
  }
}
