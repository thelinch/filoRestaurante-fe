export interface IngresoLote {
  idProyIngresoLote?: number;
  numeroIngreso: number;
  estadoNombre: string;
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
  fechaIngreso: Date | string;
  fecIngresoLevante: Date | string;
  fecIngresoProd: Date | string;
  fecFinProd: Date | string;
}
