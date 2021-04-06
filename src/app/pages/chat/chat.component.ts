import { Component, OnInit, ViewChild } from '@angular/core';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ChatUser, ChatMessage } from './chat.model';

import { chatData, chatMessagesData } from './data';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollRef') scrollRef: PerfectScrollbarDirective;
  @ViewChild('scrollElem') scrollElem: PerfectScrollbarDirective;

  username= 'Steven Franklin';

  // bread crumb items
  breadCrumbItems: Array<{}>;

  chatData: ChatUser[];
  chatMessagesData: ChatMessage[];

  formData: FormGroup;

  // Form submit
  chatSubmit: boolean;

  usermessage: string;

  constructor(public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Skote' }, { label: 'Chat', active: true }];

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
    this.onListScroll(this);
    this._fetchData();
  }

  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  private _fetchData() {
    this.chatData = chatData;
    this.chatMessagesData = chatMessagesData;
  }

  onListScroll(elem: any) {
    if (typeof (elem.directiveRef) !== "undefined") {
      setTimeout(() => {
        elem.directiveRef.scrollToBottom(0, 0);
      }, 700);
    } else {
      setTimeout(() => {
        elem.scrollRef.directiveRef.scrollToBottom(0, 0);
        elem.scrollElem.directiveRef.scrollToBottom(0, 0);
      }, 700);
    }
  }

  chatUsername(name) {
    this.username = name;
    this.usermessage = 'Hello';
    this.chatMessagesData = [];
    const currentDate = new Date();

    this.chatMessagesData.push({
      name: this.username,
      message: this.usermessage,
      time: currentDate.getHours() + ':' + currentDate.getMinutes()
    });
   
  }

  /**
   * Save the message in chat
   */
  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatMessagesData.push({
        align: 'right',
        name: 'Henry Wells',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });
      this.onListScroll(this)
      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });
    }

    this.chatSubmit = true;
  }

}
