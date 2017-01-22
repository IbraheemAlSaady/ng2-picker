import { Component, ElementRef, forwardRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';


export const DATE_PICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimePickerComponent),
  multi: true
};

@Component({
  selector: 'time-picker',
  // templateUrl: './time-picker.component.html',
  // styleUrls: ['./time-picker.component.css'], 
  template: `
    <h1>time picker is working</h1>
  `,
  providers: [DATE_PICKER_VALUE_ACCESSOR]
})
export class TimePickerComponent implements ControlValueAccessor, OnInit {

  constructor() { }

  ngOnInit() {
    
  }

  time = 'this is my value awdawd'


  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => {};

  writeValue(value: any) {
    console.log(value);
    this.time = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  onClick() {
    this.onChangeCallback('time value has been changed');
  }
}
