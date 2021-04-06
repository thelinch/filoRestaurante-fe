import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart, transactions, statData } from './data';
import { ChartType } from './dashboard.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions;
  statData;
  @ViewChild('content') content;
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    /**
     * Fetches the data
     */
    this.fetchData();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.openModal();
    }, 2000);
  }
  /**
   * Fetches the data
   */
  private fetchData() {
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;
    this.transactions = transactions;
    this.statData = statData;
  }
  openModal() {
    this.modalService.open(this.content, { centered: true });
  }
}
