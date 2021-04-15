export interface Lote {
  IdProyIngresoLote?: number;
  numeroIngreso: number;
  loteInicial: number;
  nombreIngreso: string;
  poblacionLh: number;
  poblacionLm: number;
  semanasLevante: number;
  semanasProduccion: number;
  factoMortLev: number;
  factorMortProdLh: number;
  factorMortProdLm: number;
  factorCastigo: number;
  fecIngresoLevante: Date | string;
  fecIngresoProd: Date | string;
  fecFinProd: Date | string;
}
