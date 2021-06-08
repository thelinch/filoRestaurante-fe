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
    porcentajePosturaReal: number;
    saldoAvesReal: number;
    saldoBbsReal: number;

    saldoHiReal: number;
    porcentajeHiReal: number;
    porcentajeNacimientoReal: number;
  };
  lineaMacho: {
    porcentajeNacimiento: number;
    porcentajePostura: number;
    porcentajeHi: number;
    saldoAves: number;
    saldoAvesReal: number;
    porcentajePosturaReal: number;
    saldoBbs: number;
    saldoBbsReal: number;
    saldoHi: number;
    saldoHiReal: number;
    porcentajeHiReal: number;
    porcentajeNacimientoReal: number;
  };
}
