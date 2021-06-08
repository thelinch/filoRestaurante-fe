export interface LoteReporte {
  lote: string;
  lineaHembra: { hi: number; bbs: number };
  lineaMacho: { hi: number; bbs: number };
}
export interface PedidoReporte {
  rucCliente: string;
  nombreCliente: string;
  pedidoMacho: number;
  pedidoHembra: number;
  color: string;
}
interface FechaConLote {
  fecha: string | Date;
  lotes: Array<LoteReporte>;
  totalMacho: number;
  pedidos: Array<PedidoReporte>;
  sumaTotalPedidoHembra: number;
  totalLineaHembra: {
    sumaTotalHuevosIncubablesHembra: number;
    sumaTotalBbsHembra: number;
  };
  totalLineaMacho: {
    sumaTotalHuevosIncubablesMachos: number;
    sumaTotalBbsMacho: number;
  };
}
export interface ReporteTotalIngreso {
  reporte: Array<FechaConLote>;
  pedidos: Array<PedidoReporte>;
  lotes: Array<string>;
  clientes: Array<PedidoReporte>;
}
