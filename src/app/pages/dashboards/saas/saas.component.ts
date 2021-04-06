import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';

import { earningLineChart, salesAnalyticsDonutChart, ChatData } from './data';
import { ChartType, ChatMessage } from './saas.model';

@Component({
  selector: 'app-saas',
  templateUrl: './saas.component.html',
  styleUrls: ['./saas.component.scss']
})
/**
 * Saas-dashboard component
 */
export class SaasComponent implements OnInit {

  @ViewChild('scrollRef') scrollRef: PerfectScrollbarDirective;

  // bread crumb items
  breadCrumbItems: Array<{}>;

  earningLineChart: ChartType;
  salesAnalyticsDonutChart: ChartType;
  ChatData: ChatMessage[];

  formData: FormGroup;

  // Form submit
  chatSubmit: boolean;

  configData;

  constructor(public formBuilder: FormBuilder) { }
  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboards' }, { label: 'Saas', active: true }];

    this._fetchData();

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });

    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };
  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.ChatData.push({
        align: 'right',
        name: 'Henry Wells',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });

      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }

  private _fetchData() {
    this.earningLineChart = earningLineChart;
    this.salesAnalyticsDonutChart = salesAnalyticsDonutChart;
    this.ChatData = ChatData;

    this.onListScroll(this);
  }

  onListScroll(elem: any) {
    if (typeof (elem.directiveRef) !== "undefined") {
      setTimeout(() => {
        elem.directiveRef.scrollToBottom(0, 0);
      }, 700);
    } else {
      setTimeout(() => {
        elem.scrollRef.directiveRef.scrollToBottom(0, 0);
      }, 700);
    }
  }
}
