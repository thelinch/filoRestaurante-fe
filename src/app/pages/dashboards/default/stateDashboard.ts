import { IngresoLote } from "src/app/models/IngresoLote";

export default interface StateDashboard {
  link: string;
  ingresoLoteSeleccionado: IngresoLote;
  categoria: string;
  subcategoria: string;
}
