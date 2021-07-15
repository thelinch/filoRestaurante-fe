import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-sales-today",
  templateUrl: "./sales-today.component.html",
  styleUrls: ["./sales-today.component.scss"],
})
export class SalesTodayComponent implements OnInit {
  sumSalesToday: number = 0;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getsumSalesToday();
  }
  async getsumSalesToday() {
    this.sumSalesToday = await this.http
      .get<number>(environment.apiUrl + "/orders/sumSalesToday")
      .toPromise();
  }
}
