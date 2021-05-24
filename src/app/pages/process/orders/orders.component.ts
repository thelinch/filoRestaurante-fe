import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import { TableCustomGenericComponent } from "src/app/common/table-custom-generic/table-custom-generic.component";
import { EventService } from "src/app/core/services/event.service";
import { LoaderService } from "src/app/core/services/loader.service";
import { PedidoVenta } from "src/app/models/pedidoVenta";
import { Props } from "src/app/models/PropsForm";
import { PedidoService } from "src/app/services/pedido.service";

@Component({
  selector: "app-orders-custom",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  @ViewChild("editAndCreateOrder")
  modalFormCreateAndEditOrder: TemplateRef<any>;
  propsFormularioCliente: Props;
  listaPedidoVenta: Array<PedidoVenta>;
  pedidoVentaEdicion: PedidoVenta;
  estaCargandoPeticion: Observable<boolean>;
  instanciaModalFormularioPedidoVenta: any;
  formularioFiltradoPedidos: FormGroup;
  constructor(
    private modalService: NgbModal,
    private pedidoService: PedidoService,
    private eventServie: EventService,
    private loaderService: LoaderService,
    private fb: FormBuilder
  ) {
    this.estaCargandoPeticion = this.loaderService.isLoading;
    this.listaPedidoVenta = [];
  }

  ngOnInit(): void {
    this.crearFormularioFiltradoPedidos();
    this.propsFormularioCliente = {
      formControlName: "rucClientes",
      name: "Clientes",
      placeholder: "Ingrese los clientes",
      validators: [
        {
          message: "Ingrese al menos un cliente",
          validator: Validators.required,
          validatorName: "required",
        },
      ],
    };
    this.listarPedidoVenta();
    this.eventServie.subscribe(
      "submitSuccessPedidoVentaDetalle",
      (pedidoVenta: PedidoVenta) => {
        console.log("pedidoVenta", pedidoVenta);
        const index = this.listaPedidoVenta.findIndex(
          (pedido) => pedido.id == pedidoVenta.id
        );
        if (index == -1) {
          this.listaPedidoVenta.push(pedidoVenta);
        } else {
          this.listaPedidoVenta[index] = pedidoVenta;
        }
        this.cerrarModalFormularioPedidoVenta();
      }
    );
  }
  crearNuevoPedido() {
    this.pedidoVentaEdicion = null;
    this.instanciaModalFormularioPedidoVenta = this.modalService.open(
      this.modalFormCreateAndEditOrder,
      { size: "lg" }
    );
  }
  async crearFormularioFiltradoPedidos() {
    this.formularioFiltradoPedidos = this.fb.group({
      rucClientes: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
    });
  }

  async exportarExcel() {
    this.formularioFiltradoPedidos.markAllAsTouched();
    if (this.formularioFiltradoPedidos.invalid) {
      return;
    }
    const { fechaInicio, fechaFin, rucClientes } =
      this.formularioFiltradoPedidos.value;
    const respuesta = await this.pedidoService
      .exportarExcel({ fechaFin, fechaInicio, rucClientes })
      .toPromise();
    window.open(respuesta.rutaCompletaCM);
  }
  cerrarModalFormularioPedidoVenta() {
    this.instanciaModalFormularioPedidoVenta?.close();
  }
  async listarPedidoVenta() {
    this.listaPedidoVenta = (await this.pedidoService.listar().toPromise()).map(
      (predidoVenta: PedidoVenta) => ({
        ...predidoVenta,
        cliente: {
          CL_CNOMCLI: predidoVenta.nombreCliente,
          CL_CNUMRUC: predidoVenta.rucCliente,
        },
      })
    );
  }
  async editar(pedidoVenta: PedidoVenta) {
    this.pedidoVentaEdicion = pedidoVenta;
    this.pedidoVentaEdicion.detalles = await this.pedidoService
      .listarPedidoDetallePorIdPedidoVenta(pedidoVenta.id)
      .toPromise();
    this.instanciaModalFormularioPedidoVenta = this.modalService.open(
      this.modalFormCreateAndEditOrder,
      { size: "lg" }
    );
  }
  get formularioClientesControles() {
    return this.formularioFiltradoPedidos.controls;
  }
}
