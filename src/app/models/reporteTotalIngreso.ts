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
}
interface FechaConLote {
  fecha: string | Date;
  lotes: Array<LoteReporte>;
}
export interface ReporteTotalIngreso {
  reporte: Array<FechaConLote>;
  totalLineaHembra: {
    sumaTotalHuevosIncubablesHembra: number;
    sumaTotalBbsHembra: number;
  };
  totalLineaMacho: {
    sumaTotalHuevosIncubablesMachos: number;
    sumaTotalBbsMacho: number;
  };
  pedidos: Array<PedidoReporte>;
  lotes: Array<string>;
  clientes: Array<PedidoReporte>;
}
