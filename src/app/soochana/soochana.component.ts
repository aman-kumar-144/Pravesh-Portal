import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-soochana',
  templateUrl: './soochana.component.html',
  styleUrls: ['./soochana.component.scss']
})

export class SoochanaComponent implements OnInit {
  @Input() overlayZ !: number;
  @Output() ok: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  purpose !: string;
  needOk = true;
  needCancel = false;
  show = false;
  messageType !: string;
  err !: string;
  title !: string;
  headerBackground !: string;
  dialogZ !: number;
  openingMessage !: string;
  statusMessage !: string;
  verboseStatus !: string;
  errorMessage !: string;
  
  ngOnInit(): void {
  }

  showDialog(message: string, messageType: string, status: string = '', verboseStatus: string = '', error: string = '') {
    this.overlayZ = (this.overlayZ) ? this.overlayZ : 1000;
    this.dialogZ = (this.overlayZ + 5);
    this.show = true;
    this.messageType = messageType;
    this.openingMessage = message;
    this.statusMessage = status;
    this.verboseStatus = verboseStatus;
    this.errorMessage = error;
    
    console.log("Inside showDialog() in Soochana Component");
    console.log("The Parameters are ",this.overlayZ," : ",this.dialogZ);
    console.log("The Message Type is ",this.messageType);
    console.log("The Opening Message is ",this.openingMessage);
  }

  error(purpose: string, err: any, title: string = '') {
    this.purpose = purpose;
    this.needOk = true;
    this.needCancel = false;
    this.title = !title ? 'Oops: Something Went Wrong !!' : title;
    const message = 'Please find the exact error message here:';
    this.showDialog(message, 'error', JSON.stringify(err.status),
                    err.error.error, err.error.message);
    this.headerBackground = 'red';
  }

  info(purpose: string, message: string, title: string = '') {
    this.purpose = purpose;
    this.needOk = true;
    this.needCancel = false;
    this.title = !title ? 'Please Note: FYI' : title;
    this.showDialog(message, 'info');
    this.headerBackground = 'blue';
  }

  success(purpose: string, message: string, title: string = '') {
    this.purpose = purpose;
    this.needOk = true;
    this.needCancel = false;
    this.title = !title ? 'Awesome: It Worked !!' : title;
    this.showDialog(message, 'success');
    this.headerBackground = 'green';
  }

  confirm(purpose: string, message: string, title: string = '') {
    this.purpose = purpose;
    this.needOk = true;
    this.needCancel = true;
    this.title = !title ? 'Please Confirm' : title;
    this.showDialog(message, 'confirm');
    this.headerBackground = 'blue';
  }

  onOk() {
    this.show = false;
    this.ok.emit({purpose: this.purpose, status: true});
    this.purpose = '';
  }

  onCancel() {
    this.show = false;
    this.cancel.emit({purpose: this.purpose, status: false});
    this.purpose = '';
  }
}
