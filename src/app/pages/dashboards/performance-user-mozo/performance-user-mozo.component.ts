import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { EnumLoading } from "src/app/models/estadoLoading";
import { environment } from "src/environments/environment";
import { ChartOptions } from "../default/dashboard.model";

@Component({
  selector: "app-performance-user-mozo",
  templateUrl: "./performance-user-mozo.component.html",
  styleUrls: ["./performance-user-mozo.component.scss"],
})
export class PerformanceUserMozoComponent implements OnInit {
  stateLoading: EnumLoading = EnumLoading.cargando;
  chartModelPerformaceUser: Partial<ChartOptions> = {};
  listaPerformaceUser: any[];
  constructor(private http: HttpClient) {
    this.chartModelPerformaceUser.chart = {
      type: "bar",
      height: "250",
    };
    this.chartModelPerformaceUser.title = {
      text: "Ventas diarias en soles de los mozos",
    };
    this.chartModelPerformaceUser.plotOptions = {
      bar: {
        horizontal: true,
      },
    };
    this.listaPerformaceUser = [];
  }

  ngOnInit(): void {
    this.generateGrafic();
  }
  async generateGrafic() {
    this.chartModelPerformaceUser.series = [];
    this.chartModelPerformaceUser.noData = { text: "Cargando..." };
    this.listaPerformaceUser = await this.http
      .get<any[]>(environment.apiUrl + "/orders/user/valorations")
      .toPromise();
    if (this.listaPerformaceUser.length === 0) {
      this.chartModelPerformaceUser.noData = { text: "Sin datos que mostrar" };
    }
    const usersName = this.listaPerformaceUser.map((l) => l.userName);
    this.chartModelPerformaceUser.series.push({
      name: "Ventas",
      data: this.listaPerformaceUser.map((l) => l.totalVentas),
    });
    this.chartModelPerformaceUser.xaxis = { categories: usersName };
  }
}
