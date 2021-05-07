export interface pedidoVentaDetalle {
  id?: number;
  fechaPedido: string | Date;
  cantidadHembras: number;
  cantidadMachos: number;
  fechaRegistro: string | Date;
}
/* class pedidoVentaDetalleClass implements pedidoVentaDetalle {
  id?: number;
  fechaPedido: string | Date;
  cantidadHembras: number;
  cantidadMachos: number;
  fechaRegistro: string | Date;
  set cantidadMachos$(cantidadHembras: number) {
      this.cantidadMachos=cantidadHembras
  }
} */
