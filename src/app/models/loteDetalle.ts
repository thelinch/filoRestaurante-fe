export interface LoteDetalleView {
  fechaMovimiento: string | Date;
  semana: number;
  tipo: string;
  lineaHembra: {
    porcentajeNacimiento: number;
    porcentajeHi: number;
    porcentajePostura: number;
    saldoAves: number;
    saldoBbs: number;
    saldoHi: number;
  };
  lineaMacho: {
    porcentajeNacimiento: number;
    porcentajePostura: number;
    porcentajeHi: number;
    saldoAves: number;
    saldoBbs: number;
    saldoHi: number;
  };
}
