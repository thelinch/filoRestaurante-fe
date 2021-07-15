import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { EnumLoading } from "src/app/models/estadoLoading";
import { environment } from "src/environments/environment";
import { ChartOptions } from "../default/dashboard.model";

@Component({
  selector: "app-product-must-sales",
  templateUrl: "./product-must-sales.component.html",
  styleUrls: ["./product-must-sales.component.scss"],
})
export class ProductMustSalesComponent implements OnInit {
  formFilter: FormGroup;
  listProductMustSales: any[];
  stateLoading: EnumLoading = EnumLoading.cargando;
  chartModelPerformaceProduct: Partial<ChartOptions> = {};
  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.listProductMustSales = [];
    this.chartModelPerformaceProduct.chart = {
      type: "bar",
      height: "250",
    };
    this.chartModelPerformaceProduct.title = {
      text: "Cantidad de ordenes de los productos",
    };
    this.chartModelPerformaceProduct.plotOptions = {
      bar: {
        horizontal: true,
      },
    };
    this.chartModelPerformaceProduct.series = [];
  }

  ngOnInit(): void {
    this.createForm();
    // this.generateGrafic();
  }
  createForm() {
    this.formFilter = this.fb.group({
      fechaInicio: [new Date(), [Validators.required]],
      fechaFin: [new Date(), [Validators.required]],
    });
  }
  get formFilterControls() {
    return this.formFilter.controls;
  }
  async generateGrafic() {
    if (this.formFilter.invalid) {
      return;
    }
    this.chartModelPerformaceProduct.series = [];
    this.chartModelPerformaceProduct.noData = { text: "Cargando..." };
    const { fechaInicio, fechaFin } = this.formFilter.value;
    this.listProductMustSales = await this.http
      .post<any[]>(environment.apiUrl + "/orders/product/mostSales", {
        fechaInicio: moment(fechaInicio).format("YYYY-MM-DD"),
        fechaFin: moment(fechaFin).format("YYYY-MM-DD"),
      })
      .toPromise();
    if (this.listProductMustSales.length === 0) {
      this.chartModelPerformaceProduct.noData = {
        text: "Sin datos que mostrar",
      };
    }
    const productsName = this.listProductMustSales.map((l) => l.productName);
    const totalOrderProducts = this.listProductMustSales.map(
      (l) => l.totalOrderQuantity
    );
    this.chartModelPerformaceProduct.series.push({
      name: "numero de ordener",
      data: totalOrderProducts,
    });
    this.chartModelPerformaceProduct.xaxis = { categories: productsName };
  }
}
