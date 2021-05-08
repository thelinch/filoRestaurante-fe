import { pedidoVentaDetalle } from "./pedidoVentaDetalle";

export interface PedidoVenta {
  id?: number;
  rucCliente: string;
  nombreCliente: string;
  fechaRegistro: string | Date;
  detalles:Array<pedidoVentaDetalle>
}
