import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TableCustomGenericComponent } from "src/app/common/table-custom-generic/table-custom-generic.component";
import { EventService } from "src/app/core/services/event.service";
import { PedidoVenta } from "src/app/models/pedidoVenta";
import { PedidoService } from "src/app/services/pedido.service";

@Component({
  selector: "app-orders-custom",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  @ViewChild("editAndCreateOrder")
  modalFormCreateAndEditOrder: TemplateRef<any>;
  listaPedidoVenta: Array<PedidoVenta>;
  pedidoVentaEdicion: PedidoVenta;
  constructor(
    private modalService: NgbModal,
    private pedidoService: PedidoService,
    private eventServie: EventService
  ) {
    this.listaPedidoVenta = [];
  }

  ngOnInit(): void {
    this.listarPedidoVenta();
    this.eventServie.subscribe(
      "submitSuccessPedidoVentaDetalle",
      (pedidoVenta: PedidoVenta) => {
        console.log("pedidoVenta", pedidoVenta);
        this.listaPedidoVenta.push(pedidoVenta);
      }
    );
  }
  crearNuevoPedido() {
    this.pedidoVentaEdicion = null;
    this.modalService.open(this.modalFormCreateAndEditOrder, { size: "lg" });
  }
  async listarPedidoVenta() {
    this.listaPedidoVenta = await this.pedidoService.listar().toPromise();
  }
  async editar(pedidoVenta: PedidoVenta) {
    this.pedidoVentaEdicion = pedidoVenta;
    this.pedidoVentaEdicion.detalles = await this.pedidoService
      .listarPedidoDetallePorIdPedidoVenta(pedidoVenta.id)
      .toPromise();
    this.modalService.open(this.modalFormCreateAndEditOrder, { size: "lg" });
  }
}
