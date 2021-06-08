import { pedidoVentaDetalle } from "./pedidoVentaDetalle";

export interface PedidoVenta {
  id?: number;
  rucCliente: string;
  nombreCliente: string;
  cliente: { CL_CNUMRUC: string; CL_CNOMCLI: string };
  fechaRegistro: string | Date;
  color: string;
  detalles: Array<pedidoVentaDetalle>;
}
