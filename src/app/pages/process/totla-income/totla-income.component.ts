import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ReporteTotalIngreso } from "src/app/models/reporteTotalIngreso";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-totla-income",
  templateUrl: "./totla-income.component.html",
  styleUrls: ["./totla-income.component.scss"],
})
export class TotlaIncomeComponent implements OnInit {
  totalIngreso: ReporteTotalIngreso;
  estaCargandoTotalIngreso: boolean;
  constructor(private http: HttpClient) {
    this.estaCargandoTotalIngreso = true;
  }

  ngOnInit(): void {
    this.traerTotalIngreso();
  }
  async exportarExcel() {
    const json = await this.http
      .get<any>(environment.apiUrl + "/pedidoVenta/exportarExcel")
      .toPromise();
    window.open(json.rutaCompletaCM);
  }
  async traerTotalIngreso() {
    this.estaCargandoTotalIngreso = true;
    this.totalIngreso = await this.http
      .get<ReporteTotalIngreso>(
        environment.apiUrl + "/pedidoVenta/ingreso-total"
      )
      .toPromise();
    this.estaCargandoTotalIngreso = false;
  }
}
